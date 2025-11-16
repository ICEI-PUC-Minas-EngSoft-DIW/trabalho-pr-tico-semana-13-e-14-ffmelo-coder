// ============================================
// PROJETO COLEÇÃO MAGIC - PÁGINA DE DETALHES
// ============================================
// Página de detalhes integrada com API JSON Server
// Endpoints utilizados:
//   GET /cartas/:id - Busca carta específica
//   GET /cartas - Lista todas as cartas (para navegação)
// ============================================

// ============================================
// DADOS DAS CARTAS MAGIC - CARREGADOS DA API
// ============================================

let cartas = []; // Array que será preenchido pela API

// Função para buscar cartas da API
async function carregarCartasDaAPI() {
  try {
    const response = await fetch("/cartas");
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    cartas = await response.json();
    console.log("Cartas carregadas da API para detalhes:", cartas);
    return cartas;
  } catch (error) {
    console.error("Erro ao carregar cartas da API:", error);
    // Em caso de erro, usa dados de fallback vazios
    cartas = [];
    return cartas;
  }
}

// Função para buscar carta específica da API
async function carregarCartaPorId(id) {
  try {
    const response = await fetch(`/cartas/${id}`);
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    const carta = await response.json();
    console.log("Carta específica carregada da API:", carta);
    return carta;
  } catch (error) {
    console.error("Erro ao carregar carta específica da API:", error);
    return null;
  }
}

// ============================================
// FUNÇÕES PARA PÁGINA DE DETALHES
// ============================================
function obterSimboloSet(nomeSet) {
  const simbolosSet = {
    "Double Masters": "../img/set-symbols/double-masters.png",
    "War of the Spark": "../img/set-symbols/war-of-the-spark.png",
    "Edge of Eternities: Commander": "../img/set-symbols/EOE-commander.png",
    "Duskmourn: House of Horror Commander":
      "../img/set-symbols/duskmourn-commander.png",
    "Edge of Eternities": "../img/set-symbols/EOE_expsym_m_3in.png",
    "Duskmourn: House of Horror": "../img/set-symbols/duskmourn.png",
    "The Big Score": "../img/set-symbols/big-score.png",
    Alpha: "../img/set-symbols/double-masters.png",
  };
  return simbolosSet[nomeSet] || "../img/set-symbols/double-masters.png";
}

async function carregarDetalhes() {
  const urlParams = new URLSearchParams(window.location.search);
  const cartaId = parseInt(urlParams.get("id"));

  // Carrega a carta específica da API
  const carta = await carregarCartaPorId(cartaId);

  if (!carta) {
    document.body.innerHTML =
      "<div class='container mt-5'><h1 class='text-danger'>Carta não encontrada</h1><a href='../index.html' class='btn btn-primary'>Voltar para a página inicial</a></div>";
    return;
  }

  // Ajusta os caminhos das imagens para funcionar na página de detalhes
  if (carta.imagem && !carta.imagem.startsWith("../")) {
    carta.imagem = "../" + carta.imagem;
  }

  if (carta.fotosVinculadas) {
    carta.fotosVinculadas.forEach((foto) => {
      if (foto.imagem && !foto.imagem.startsWith("../")) {
        foto.imagem = "../" + foto.imagem;
      }
    });
  }

  const imagemElement = document.getElementById("carta-imagem");
  const nomeElement = document.getElementById("carta-nome");
  const precoElement = document.getElementById("carta-preco");
  const descricaoElement = document.getElementById("carta-descricao");
  const custoManaElement = document.getElementById("carta-custo-mana");
  const raridadeElement = document.getElementById("carta-raridade");
  const poderResistenciaElement = document.getElementById(
    "carta-poder-resistencia"
  );
  const lealdadeElement = document.getElementById("carta-lealdade");
  const formatoElement = document.getElementById("carta-formato");
  const idiomaElement = document.getElementById("carta-idioma");
  const coresElement = document.getElementById("carta-cores");
  const artistaElement = document.getElementById("carta-artista");
  const setElement = document.getElementById("carta-set");
  const numeroElement = document.getElementById("carta-numero");
  const textoElement = document.getElementById("carta-texto");

  // Preencher informações básicas
  if (imagemElement) {
    imagemElement.src = carta.imagem;
    imagemElement.alt = carta.nome;
  }
  if (nomeElement) nomeElement.textContent = carta.nome;
  if (precoElement) precoElement.textContent = carta.preco;
  if (descricaoElement) descricaoElement.textContent = carta.descricao;
  if (raridadeElement) raridadeElement.textContent = carta.raridade;

  if (custoManaElement) {
    if (carta.custoMana) {
      const simbolos = {
        0: "../img/mana/0.svg",
        1: "../img/mana/1.svg",
        2: "../img/mana/2.svg",
        3: "../img/mana/3.svg",
        4: "../img/mana/4.svg",
        5: "../img/mana/5.svg",
        6: "../img/mana/6.svg",
        7: "../img/mana/7.svg",
        8: "../img/mana/8.svg",
        9: "../img/mana/9.svg",
        W: "../img/mana/W.svg",
        U: "../img/mana/U.svg",
        B: "../img/mana/B.svg",
        R: "../img/mana/R.svg",
        G: "../img/mana/G.svg",
        C: "../img/mana/C.svg",
      };

      let custoHTML = "";
      for (let char of carta.custoMana) {
        if (simbolos[char]) {
          custoHTML += `<img src="${simbolos[char]}" alt="${char}" class="simbolo-mana">`;
        }
      }
      custoManaElement.innerHTML = custoHTML || "—";
    } else {
      custoManaElement.textContent = "—";
    }
  }

  if (poderResistenciaElement) {
    if (carta.detalhes.poder && carta.detalhes.resistencia) {
      poderResistenciaElement.textContent = `${carta.detalhes.poder}/${carta.detalhes.resistencia}`;
    } else {
      poderResistenciaElement.textContent = "—";
    }
  }

  if (lealdadeElement) {
    lealdadeElement.textContent = carta.detalhes.lealdade || "—";
  }

  if (formatoElement) formatoElement.textContent = carta.detalhes.formato;
  if (idiomaElement) idiomaElement.textContent = "Inglês";
  if (artistaElement) artistaElement.textContent = carta.detalhes.artista;
  if (setElement) setElement.textContent = carta.detalhes.set;
  if (numeroElement) numeroElement.textContent = carta.detalhes.numero;

  if (coresElement) {
    const simbolosCores = {
      branco: "../img/mana/W.svg",
      azul: "../img/mana/U.svg",
      preto: "../img/mana/B.svg",
      vermelho: "../img/mana/R.svg",
      verde: "../img/mana/G.svg",
      incolor: "../img/mana/C.svg",
    };

    coresElement.innerHTML = "";
    carta.cores.forEach((cor) => {
      if (simbolosCores[cor]) {
        const img = document.createElement("img");
        img.src = simbolosCores[cor];
        img.alt = cor;
        img.className = "simbolo-mana";
        coresElement.appendChild(img);
      }
    });
  }

  if (textoElement) {
    textoElement.textContent = carta.detalhes.texto;
  }

  carregarFotosVinculadas(carta);
}

function carregarFotosVinculadas(carta) {
  const containerFotos = document.getElementById("fotos-vinculadas");
  if (!containerFotos || !carta.fotosVinculadas) return;

  containerFotos.innerHTML = "";

  carta.fotosVinculadas.forEach((foto, index) => {
    const divFoto = document.createElement("div");
    divFoto.className = "col-md-4 mb-3";

    divFoto.innerHTML = `
      <div class="foto-vinculada">
        <div class="foto-container" onclick="abrirModalImagem('${foto.imagem}', '${foto.titulo}')">
          <img src="${foto.imagem}" alt="${foto.titulo}">
        </div>
        <h6 class="text-center mt-2 text-muted">${foto.titulo}</h6>
      </div>
    `;

    containerFotos.appendChild(divFoto);
  });

  criarModalImagem();
}

function criarModalImagem() {
  if (document.getElementById("modalImagem")) return;

  const modal = document.createElement("div");
  modal.className = "modal fade";
  modal.id = "modalImagem";
  modal.setAttribute("tabindex", "-1");
  modal.innerHTML = `
    <div class="modal-dialog modal-fullscreen">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title text-white" id="modalImagemTitulo">Visualizar Imagem</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body d-flex justify-content-center align-items-center">
          <img id="modalImagemSrc" src="" alt="" style="max-width: 100%; max-height: 100%; object-fit: contain;">
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

function abrirModalImagem(src, titulo) {
  const modalImagem = document.getElementById("modalImagem");
  const modalTitulo = document.getElementById("modalImagemTitulo");
  const modalSrc = document.getElementById("modalImagemSrc");

  if (modalTitulo) modalTitulo.textContent = titulo;
  if (modalSrc) modalSrc.src = src;

  const modal = new bootstrap.Modal(modalImagem);
  modal.show();
}

async function configurarNavegacaoCartas() {
  const btnAnterior = document.getElementById("carta-anterior");
  const btnProxima = document.getElementById("carta-proxima");

  if (!btnAnterior || !btnProxima) return;

  // Carrega todas as cartas da API se ainda não foram carregadas
  if (cartas.length === 0) {
    await carregarCartasDaAPI();
  }

  const urlParams = new URLSearchParams(window.location.search);
  const cartaAtual = parseInt(urlParams.get("id"));
  const origem = urlParams.get("origem") || "todas";

  const carta = cartas.find((c) => c.id === cartaAtual);
  if (!carta) return;

  let cartasParaNavegacao;
  if (origem === "destaque") {
    cartasParaNavegacao = cartas.filter((c) => c.categoria === "Destaque");
  } else {
    cartasParaNavegacao = cartas;
  }

  const indexAtual = cartasParaNavegacao.findIndex((c) => c.id === cartaAtual);

  if (indexAtual > 0) {
    const cartaAnterior = cartasParaNavegacao[indexAtual - 1];
    btnAnterior.addEventListener("click", () => {
      window.location.href = `../html/detalhes.html?id=${cartaAnterior.id}&origem=${origem}`;
    });
    btnAnterior.disabled = false;
    btnAnterior.title = `← ${cartaAnterior.nome}`;
  } else {
    btnAnterior.disabled = true;
    const contexto = origem === "destaque" ? "cartas em destaque" : "coleção";
    btnAnterior.title = `Primeira carta da ${contexto}`;
  }

  if (indexAtual < cartasParaNavegacao.length - 1) {
    const cartaProxima = cartasParaNavegacao[indexAtual + 1];
    btnProxima.addEventListener("click", () => {
      window.location.href = `../html/detalhes.html?id=${cartaProxima.id}&origem=${origem}`;
    });
    btnProxima.disabled = false;
    btnProxima.title = `${cartaProxima.nome} →`;
  } else {
    btnProxima.disabled = true;
    const contexto = origem === "destaque" ? "cartas em destaque" : "coleção";
    btnProxima.title = `Última carta da ${contexto}`;
  }
}

// ============================================
// INICIALIZAÇÃO DA APLICAÇÃO
// ============================================

document.addEventListener("DOMContentLoaded", async () => {
  await carregarDetalhes();
  await configurarNavegacaoCartas();
});
