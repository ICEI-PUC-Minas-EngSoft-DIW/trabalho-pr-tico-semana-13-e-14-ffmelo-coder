// URL da API
const API_URL = "http://localhost:3000/cartas";

// Variáveis para armazenar os gráficos
let chartCores,
  chartRaridade,
  chartCustoMana,
  chartTipos,
  chartCategorias,
  chartValorMedio;

// Função para carregar dados da API
async function carregarDados() {
  try {
    const response = await fetch(API_URL);
    const cartas = await response.json();
    return cartas;
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    return [];
  }
}

// Função para extrair o valor numérico do preço
function extrairValor(precoString) {
  // Remove "BRL " e substitui vírgula por ponto
  const valor = precoString.replace("BRL ", "").replace(",", ".");
  return parseFloat(valor);
}

// Função para calcular estatísticas básicas
function calcularEstatisticas(cartas) {
  const totalCartas = cartas.length;
  const totalMythic = cartas.filter((c) => c.raridade === "Mythic Rare").length;
  const totalRare = cartas.filter((c) => c.raridade === "Rare").length;

  const valorTotal = cartas.reduce((acc, carta) => {
    return acc + extrairValor(carta.preco);
  }, 0);

  document.getElementById("totalCartas").textContent = totalCartas;
  document.getElementById("totalMythic").textContent = totalMythic;
  document.getElementById("totalRare").textContent = totalRare;
  document.getElementById("valorTotal").textContent = `R$ ${valorTotal.toFixed(
    2
  )}`;
}

// Função para criar gráfico de cores
function criarGraficoCores(cartas) {
  const coresCount = {};

  cartas.forEach((carta) => {
    carta.cores.forEach((cor) => {
      coresCount[cor] = (coresCount[cor] || 0) + 1;
    });
  });

  const labels = Object.keys(coresCount);
  const data = Object.values(coresCount);

  // Mapeamento de cores para o gráfico
  const coresMap = {
    branco: "#F0E68C",
    azul: "#1E90FF",
    preto: "#2F4F4F",
    vermelho: "#DC143C",
    verde: "#228B22",
    incolor: "#D3D3D3",
  };

  const backgroundColors = labels.map((label) => coresMap[label] || "#808080");

  const ctx = document.getElementById("chartCores").getContext("2d");
  chartCores = new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels.map((l) => l.charAt(0).toUpperCase() + l.slice(1)),
      datasets: [
        {
          data: data,
          backgroundColor: backgroundColors,
          borderWidth: 2,
          borderColor: "#fff",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
        },
        title: {
          display: false,
        },
      },
    },
  });
}

// Função para criar gráfico de raridade
function criarGraficoRaridade(cartas) {
  const raridadeCount = {};

  cartas.forEach((carta) => {
    raridadeCount[carta.raridade] = (raridadeCount[carta.raridade] || 0) + 1;
  });

  const labels = Object.keys(raridadeCount);
  const data = Object.values(raridadeCount);

  const ctx = document.getElementById("chartRaridade").getContext("2d");
  chartRaridade = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Quantidade",
          data: data,
          backgroundColor: [
            "rgba(255, 99, 132, 0.7)",
            "rgba(54, 162, 235, 0.7)",
            "rgba(255, 206, 86, 0.7)",
            "rgba(75, 192, 192, 0.7)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
          ],
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
}

// Função para extrair custo de mana convertido
function extrairCustoManaConvertido(custoMana) {
  if (!custoMana) return 0;

  // Remove letras e soma números
  let total = 0;
  const numeros = custoMana.match(/\d+/g);
  if (numeros) {
    total = numeros.reduce((acc, num) => acc + parseInt(num), 0);
  }

  // Conta símbolos coloridos (cada letra conta como 1)
  const simbolos = custoMana.match(/[WUBRG]/g);
  if (simbolos) {
    total += simbolos.length;
  }

  return total;
}

// Função para criar gráfico de custo de mana
function criarGraficoCustoMana(cartas) {
  const custoCount = {};

  cartas.forEach((carta) => {
    const custo = extrairCustoManaConvertido(carta.custoMana);
    custoCount[custo] = (custoCount[custo] || 0) + 1;
  });

  // Ordenar por custo
  const custosOrdenados = Object.keys(custoCount)
    .sort((a, b) => parseInt(a) - parseInt(b))
    .map((k) => parseInt(k));
  const data = custosOrdenados.map((custo) => custoCount[custo]);

  const ctx = document.getElementById("chartCustoMana").getContext("2d");
  chartCustoMana = new Chart(ctx, {
    type: "line",
    data: {
      labels: custosOrdenados,
      datasets: [
        {
          label: "Quantidade de Cartas",
          data: data,
          backgroundColor: "rgba(255, 159, 64, 0.2)",
          borderColor: "rgba(255, 159, 64, 1)",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: "rgba(255, 159, 64, 1)",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
        x: {
          title: {
            display: true,
            text: "Custo de Mana Convertido",
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
      },
    },
  });
}

// Função para criar gráfico de tipos
function criarGraficoTipos(cartas) {
  const tiposCount = {};

  // Lista de tipos principais válidos do Magic
  const tiposValidos = [
    "Artifact",
    "Creature",
    "Enchantment",
    "Instant",
    "Land",
    "Planeswalker",
    "Sorcery",
    "Tribal",
    "Legendary",
  ];

  cartas.forEach((carta) => {
    // Extrai apenas a parte antes do "—" (tipos, sem subtipos)
    const parteTipos = carta.descricao.split("—")[0].trim();

    // Separa os tipos individuais
    const tipos = parteTipos.split(" ");

    // Conta cada tipo válido separadamente
    tipos.forEach((tipo) => {
      if (tiposValidos.includes(tipo)) {
        tiposCount[tipo] = (tiposCount[tipo] || 0) + 1;
      }
    });
  });

  const labels = Object.keys(tiposCount).sort();
  const data = labels.map((label) => tiposCount[label]);

  const ctx = document.getElementById("chartTipos").getContext("2d");
  chartTipos = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Quantidade",
          data: data,
          backgroundColor: "rgba(153, 102, 255, 0.7)",
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 2,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
}

// Função para criar gráfico de categorias
function criarGraficoCategorias(cartas) {
  const categoriasCount = {};

  cartas.forEach((carta) => {
    categoriasCount[carta.categoria] =
      (categoriasCount[carta.categoria] || 0) + 1;
  });

  const labels = Object.keys(categoriasCount);
  const data = Object.values(categoriasCount);

  const ctx = document.getElementById("chartCategorias").getContext("2d");
  chartCategorias = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: [
            "rgba(255, 99, 132, 0.7)",
            "rgba(54, 162, 235, 0.7)",
            "rgba(255, 206, 86, 0.7)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
          ],
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
        },
        title: {
          display: true,
          text: "Distribuição por Categoria",
        },
      },
    },
  });
}

// Função para criar gráfico de valor médio por categoria
function criarGraficoValorMedio(cartas) {
  const categorias = {};

  cartas.forEach((carta) => {
    if (!categorias[carta.categoria]) {
      categorias[carta.categoria] = { total: 0, count: 0 };
    }
    categorias[carta.categoria].total += extrairValor(carta.preco);
    categorias[carta.categoria].count += 1;
  });

  const labels = Object.keys(categorias);
  const data = labels.map(
    (cat) => categorias[cat].total / categorias[cat].count
  );

  const ctx = document.getElementById("chartValorMedio").getContext("2d");
  chartValorMedio = new Chart(ctx, {
    type: "polarArea",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Valor Médio (R$)",
          data: data,
          backgroundColor: [
            "rgba(255, 99, 132, 0.5)",
            "rgba(54, 162, 235, 0.5)",
            "rgba(255, 206, 86, 0.5)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
          ],
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
        },
        title: {
          display: true,
          text: "Valor Médio por Categoria",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return context.label + ": R$ " + context.parsed.r.toFixed(2);
            },
          },
        },
      },
      scales: {
        r: {
          beginAtZero: true,
        },
      },
    },
  });
}

// Função principal para inicializar os gráficos
async function inicializarGraficos() {
  const cartas = await carregarDados();

  if (cartas.length === 0) {
    console.error("Nenhuma carta carregada!");
    return;
  }

  // Calcular e exibir estatísticas
  calcularEstatisticas(cartas);

  // Criar todos os gráficos
  criarGraficoCores(cartas);
  criarGraficoRaridade(cartas);
  criarGraficoCustoMana(cartas);
  criarGraficoTipos(cartas);
  criarGraficoCategorias(cartas);
  criarGraficoValorMedio(cartas);
}

// Inicializar quando a página carregar
document.addEventListener("DOMContentLoaded", inicializarGraficos);
