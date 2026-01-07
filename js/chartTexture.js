import * as THREE from 'three';
import * as echarts from 'echarts';

export function setupChartTexture(screenMesh) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  canvas.style.display = 'none';
  document.body.appendChild(canvas);

  const chartInstance = echarts.init(canvas, null, { renderer: 'canvas' });

  let chartData = [];
  let chartTitle = '实时数据监控:';

  function initializeChartData() {
    chartData = [];
    const now = Date.now();
    for (let i = 9; i >= 0; i--) {
      chartData.push({
        time: now - i * 5000,
        value: Math.random() * 100
      });
    }
  }

  function updateChartData() {
    chartData.push({
      time: Date.now(),
      value: Math.random() * 100
    });
    if (chartData.length > 10) {
      chartData.shift();
    }
  }

  function updateChart() {
    const formattedData = chartData.map(item => ({
      time: new Date(item.time).toLocaleTimeString('zh-CN', { hour12: false }),
      value: Number(item.value).toFixed(2)
    }));
    const option = {
      title: {
        text: chartTitle,
        textStyle: { color: '#fff', fontSize: 14 },
        left: '10%',
        top: '20%'
      },
      tooltip: {
        trigger: 'axis',
        textStyle: { color: '#fff' },
        backgroundColor: 'rgba(0,0,0,0.2)'
      },
      xAxis: {
        type: 'category',
        data: formattedData.map(item => item.time),
        axisLine: { lineStyle: { color: '#fff' } },
        axisLabel: { color: '#fff', fontSize: 10, rotate: 45 }
      },
      yAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: '#fff' } },
        axisLabel: { color: '#fff' },
        splitLine: { show: false }
      },
      series: [{
        data: formattedData.map(item => item.value),
        type: 'line',
        smooth: true,
        lineStyle: { color: '#00ff00' },
        itemStyle: { color: '#00ff00' }
      }],
      backgroundColor: 'rgba(0,0,0,0.2)',
      grid: { left: '12%', right: '10%', top: '30%', bottom: '35%' }
    };
    chartInstance.setOption(option, true);
  }

  initializeChartData();
  updateChart();
  setInterval(() => {
    updateChartData();
    updateChart();
  }, 5000);

  const chartTexture = new THREE.CanvasTexture(canvas);
  chartTexture.minFilter = THREE.LinearFilter;
  chartTexture.magFilter = THREE.LinearFilter;
  chartTexture.format = THREE.RGBAFormat;
  chartTexture.generateMipmaps = false;
  chartTexture.wrapS = THREE.ClampToEdgeWrapping;
  chartTexture.wrapT = THREE.ClampToEdgeWrapping;

  if (!screenMesh.geometry.attributes.uv) {
    generateUVCoordinates(screenMesh.geometry);
  }

  const chartMaterial = new THREE.MeshBasicMaterial({
    map: chartTexture,
    transparent: false
  });
  screenMesh.material = chartMaterial;
  screenMesh.material.needsUpdate = true;

  screenMesh.chartTexture = chartTexture;
  screenMesh.canvas = canvas;
  screenMesh.chartController = {
    setTitle(text) {
      chartTitle = text && text.length ? text : '实时数据监控:';
      updateChart();
    }
  };
}

export function generateUVCoordinates(geometry) {
  const positionAttribute = geometry.attributes.position;
  const vertexCount = positionAttribute.count;
  const uvArray = new Float32Array(vertexCount * 2);
  for (let i = 0; i < vertexCount; i++) {
    uvArray[i * 2] = (positionAttribute.getX(i) + 1) / 2;
    uvArray[i * 2 + 1] = (positionAttribute.getY(i) + 1) / 2;
  }
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvArray, 2));
  geometry.attributes.uv.needsUpdate = true;
}
