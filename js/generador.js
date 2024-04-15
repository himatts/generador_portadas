document.addEventListener('DOMContentLoaded', function() {
  const combinations = [
      { name: "stable_diffusion", colors: ['#15044F', '#E96443', '#821EE6'] },
      { name: "animaciones_de_armado", colors: ['#FC5C7D', '#DE1B1B', '#821EE6'] },
      { name: "animaciones_360", colors: ['#3073F9', '#FC5C7D', '#FCA47D'] },
      { name: "buscador_de_referencias", colors: ['#1D976C', '#93F9B9', '#1D606C'] },
      { name: "recorte_de_imagenes", colors: ['#833AB4', '#F15A24', '#A2BFB6'] },
      { name: "chatbot_desarrollo", colors: ['#292E49', '#536976', '#C5A065'] },
      { name: "separador_de_planos", colors: ['#FFA861', '#DC2EFF', '#F12C1E'] },
      { name: "informes_mensuales", colors: ['#15044F', '#93278F', '#38FFCD'] },
      { name: "registro_de_tickets", colors: ['#4D4D4D', '#999999', '#022830'] },
      { name: "panel_de_instructivos", colors: ['#F12E27', '#5A1B8D', '#72B6E4'] }
  ];
  
  const select = document.getElementById('color-combination');
  combinations.forEach((combo, index) => {
      let option = document.createElement('option');
      option.value = index;
      option.textContent = combo.name.replace(/_/g, ' ');
      select.appendChild(option);
  });

  select.addEventListener('change', function() {
      const selectedColors = combinations[this.value].colors;
      document.getElementById('color1').value = selectedColors[0];
      document.getElementById('color2').value = selectedColors[1];
      document.getElementById('color3').value = selectedColors[2];
      actualizarFondoTextarea();
  });

  function actualizarFondoTextarea() {
      let color1 = document.getElementById('color1').value;
      let color2 = document.getElementById('color2').value;
      let color3 = document.getElementById('color3').value;

      document.getElementById('texto').style.setProperty('--color1', color1);
      document.getElementById('texto').style.setProperty('--color2', color2);
      document.getElementById('texto').style.setProperty('--color3', color3);
  }

  // Inicializa los colores predeterminados al cargar
  actualizarFondoTextarea();
});

function actualizarFondoTextarea() {
let color1 = document.getElementById('color1').value;
let color2 = document.getElementById('color2').value;
let color3 = document.getElementById('color3').value;

document.getElementById('texto').style.setProperty('--color1', color1);
document.getElementById('texto').style.setProperty('--color2', color2);
document.getElementById('texto').style.setProperty('--color3', color3);
}


// Añadir listeners para el tercer color picker
document.getElementById('color1').addEventListener('input', actualizarFondoTextarea);
document.getElementById('color2').addEventListener('input', actualizarFondoTextarea);
document.getElementById('color3').addEventListener('input', actualizarFondoTextarea);

function aplicarGradientes(ctx, width, height, color1, color2, color3) {
  // Aplicar gradiente lineal
  let gradLinear = ctx.createLinearGradient(0, 0, 0, height);
  gradLinear.addColorStop(0, color1);
  gradLinear.addColorStop(1, color2);
  ctx.fillStyle = gradLinear;
  ctx.fillRect(0, 0, width, height);


  // Calcular la posición y tamaño de manera proporcional
  let radialX = width * 1; // 90% del ancho
  let radialY = height * 1; // 90% del alto
  let radialRadius = Math.min(width, height) * 1.8; // Radio como 30% de la menor dimensión
  
  // Aplicar gradiente radial
  let gradRadial = ctx.createRadialGradient(radialX, radialY, 10, radialX, radialY, radialRadius);
  gradRadial.addColorStop(0, color3);
  gradRadial.addColorStop(1, 'transparent');
  ctx.fillStyle = gradRadial;
  ctx.fillRect(0, 0, width, height);


}

function descargarImagen() {
  let color1 = document.getElementById('color1').value;
  let color2 = document.getElementById('color2').value;
  let color3 = document.getElementById('color3').value; // Capturar el tercer color
  let texto = document.getElementById('texto').value;
  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d');
  canvas.width = 1920;
  canvas.height = 1080;

  aplicarGradientes(ctx, canvas.width, canvas.height, color1, color2, color3); // Pasar colores a la función

  ctx.font = '500 140px IBM Plex Mono';
  ctx.fillStyle = "#F2F2F2";
  let yBase = 357;
  let lineHeight = 160;

  texto.split('\n').forEach((linea, index) => {
    let yPos = yBase + index * lineHeight;
    let xPos = 252;

    linea.split('').forEach(char => {
      let charYPos = char === '_' ? yPos - 20 : yPos;
      ctx.fillText(char, xPos, charYPos);
      xPos += ctx.measureText(char).width;
    });
  });

  // Limpiar el nombre del archivo
  let nombreArchivo = texto.trim() // Elimina espacios al inicio y al final
                        .replace(/[\x00-\x1F\x7F\/\\:\*\?"<>\|]/g, '') // Elimina caracteres no permitidos en nombres de archivo
                        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remueve tildes
                        .replace(/\s+/g, '_'); // Reemplaza espacios con guiones bajos

  if (!nombreArchivo) {
    nombreArchivo = 'imagen'; // Nombre por defecto si el texto es inválido o vacío
  }

  let url = canvas.toDataURL('image/jpeg', 0.8);
  let a = document.createElement('a');
  a.href = url;
  a.download = `${nombreArchivo}.jpg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

document.getElementById('descargarImagen').addEventListener('click', descargarImagen);
