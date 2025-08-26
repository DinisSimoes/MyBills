import React, { useRef, useState } from "react";
import { View, Button, StyleSheet, Text, ScrollView } from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { Image } from "expo-image";
import * as FileSystem from 'expo-file-system';

type NotaFiscalData = {
  cnpj?: string;
  data?: string;
  total?: string;
};

export default function NovaFatura() {
  const [cameraType, setCameraType] = useState<CameraType>("back");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [ocrData, setOcrData] = useState<NotaFiscalData | null>(null);
  const [loading, setLoading] = useState(false);

  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);

  if (!permission) return <Text>Carregando permissões...</Text>;
  if (!permission.granted)
    return (
      <View style={styles.container}>
        <Text>Permissão necessária para acessar câmera</Text>
        <Button title="Permitir" onPress={requestPermission} />
      </View>
    );

  const takePicture = async () => {
    if (cameraRef.current) {
      const data = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      setPhotoUri(data.uri);
      //processOCR(data.uri);
    }
  };

  const toggleCamera = () => {
    setCameraType(prev => (prev === "back" ? "front" : "back"));
  };

  const processOCR = async (uri: string) => {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const response = await fetch('http://192.168.x.x:5000/ocr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ImageBase64: base64 }),
    });
    const data = await response.json();
    console.log(data.Text); // aqui você tem o texto da nota fiscal
  } catch (err) {
    console.error(err);
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!photoUri ? (
        <CameraView 
          style={styles.camera} 
          facing="back" 
          ref={cameraRef}
        />
      ) : (
        <Image source={{ uri: photoUri }} style={styles.camera} />
      )}

      <View style={styles.buttons}>
        {!photoUri && <Button title="Tirar Foto" onPress={takePicture} />}
        {!photoUri && <Button title="Trocar Câmera" onPress={toggleCamera} />}
        {photoUri && (
          <Button
            title="Tirar Outra"
            onPress={() => {
              setPhotoUri(null);
              setOcrData(null);
            }}
          />
        )}
      </View>

      {loading && <Text style={{ marginTop: 20 }}>Processando OCR...</Text>}

      {ocrData && (
        <View style={styles.table}>
          <Text style={styles.row}>CNPJ: {ocrData.cnpj}</Text>
          <Text style={styles.row}>Data: {ocrData.data}</Text>
          <Text style={styles.row}>Total: {ocrData.total}</Text>
          <Button
            title="Salvar Dados"
            onPress={() => console.log("Salvar:", ocrData)}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  camera: {
    width: "90%",
    height: 400,
    borderRadius: 10,
  },
  buttons: {
    marginTop: 20,
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  table: {
    width: "90%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 20,
  },
  row: {
    fontSize: 18,
    marginBottom: 10,
  },
});
