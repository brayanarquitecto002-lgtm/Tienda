// Prueba simple de ImgBB
const IMGBB_API_KEY = '3cdeef6e840716d034ca88855d9d0a5d';

console.log('🖼️ Probando API Key de ImgBB...');
console.log('API Key:', IMGBB_API_KEY.substring(0, 10) + '...');

// Crear imagen de prueba (1x1 pixel PNG)
const base64Image = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
const binaryString = atob(base64Image);
const bytes = new Uint8Array(binaryString.length);
for (let i = 0; i < binaryString.length; i++) {
  bytes[i] = binaryString.charCodeAt(i);
}
const blob = new Blob([bytes], { type: 'image/png' });

// Crear FormData con imagen de prueba
const formData = new FormData();
formData.append('image', blob, 'test.png');

console.log('📤 Enviando imagen de prueba...');

fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
  method: 'POST',
  body: formData,
})
.then(response => {
  console.log('📡 Respuesta HTTP:', response.status, response.statusText);
  return response.json();
})
.then(data => {
  if (data.success) {
    console.log('✅ ¡ImgBB funciona perfectamente!');
    console.log('🔗 URL de la imagen:', data.data.url);
    console.log('📊 Tamaño:', data.data.size, 'bytes');
    console.log('🖼️ Dimensiones:', data.data.width, 'x', data.data.height);
  } else {
    console.log('❌ Error en ImgBB:');
    console.log('   Código:', data.error?.code);
    console.log('   Mensaje:', data.error?.message);
  }
})
.catch(error => {
  console.log('❌ Error de conexión:', error.message);
});