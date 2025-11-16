// ============================================
// PROJETO COLEÇÃO MAGIC - FRONTEND INTEGRADO COM API
// ============================================
// Este projeto utiliza:
// - Frontend: HTML5, CSS3, JavaScript ES6+, Bootstrap 5
// - Backend: JSON Server (simulando API RESTful)
// - Endpoints disponíveis:
//   GET /cartas - Lista todas as cartas
//   GET /cartas/:id - Busca carta específica
//   POST /cartas - Cria nova carta
//   PUT /cartas/:id - Atualiza carta existente
//   DELETE /cartas/:id - Remove carta
// ============================================

// ============================================
// DADOS DAS CARTAS MAGIC - CARREGADOS DA API
// ============================================

let cartas = []; // Array que será preenchido pela API

// Função para buscar cartas da API
async function carregarCartasDaAPI() {
  try {
    // Mostra indicador de loading
    mostrarLoading();

    const response = await fetch("/cartas");
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    cartas = await response.json();
    console.log("Cartas carregadas da API:", cartas);

    // Esconde indicador de loading
    esconderLoading();

    return cartas;
  } catch (error) {
    console.error("Erro ao carregar cartas da API:", error);
    // Em caso de erro, usa dados de fallback vazios
    cartas = [];
    esconderLoading();
    mostrarErro(
      "Erro ao carregar cartas. Verifique se o servidor está rodando."
    );
    return cartas;
  }
}

// Função para mostrar loading
function mostrarLoading() {
  const containerCards = document.getElementById("container-cards");
  const carrosselInner = document.querySelector(
    "#carrosselDestaque .carousel-inner"
  );

  if (containerCards) {
    containerCards.innerHTML =
      '<div class="col-12 text-center"><div class="spinner-border text-warning" role="status"><span class="visually-hidden">Carregando...</span></div><p class="mt-2">Carregando cartas...</p></div>';
  }

  if (carrosselInner) {
    carrosselInner.innerHTML =
      '<div class="carousel-item active d-flex justify-content-center align-items-center"><div class="spinner-border text-warning" role="status"><span class="visually-hidden">Carregando...</span></div></div>';
  }
}

// Função para esconder loading
function esconderLoading() {
  // O loading será substituído pelo conteúdo real nas funções de geração
}

// Função para mostrar erro
function mostrarErro(mensagem) {
  const containerCards = document.getElementById("container-cards");
  const carrosselInner = document.querySelector(
    "#carrosselDestaque .carousel-inner"
  );

  if (containerCards) {
    containerCards.innerHTML = `<div class="col-12 text-center"><div class="alert alert-danger" role="alert"><i class="fas fa-exclamation-triangle"></i> ${mensagem}</div></div>`;
  }

  if (carrosselInner) {
    carrosselInner.innerHTML = `<div class="carousel-item active d-flex justify-content-center align-items-center"><div class="alert alert-danger" role="alert">${mensagem}</div></div>`;
  }
}

// ============================================
// FUNÇÕES UTILITÁRIAS
// ============================================

function obterClasseRaridade(raridade) {
  const classesRaridade = {
    "Mythic Rare": "raridade-mythic",
    Rare: "raridade-rare",
    Uncommon: "raridade-uncommon",
    Common: "raridade-common",
  };
  return classesRaridade[raridade] || "raridade-common";
}

function obterSimboloSet(nomeSet) {
  const simbolosSet = {
    "Double Masters": "img/set-symbols/double-masters.png",
    "War of the Spark": "img/set-symbols/war-of-the-spark.png",
    "Edge of Eternities: Commander": "img/set-symbols/EOE-commander.png",
    "Duskmourn: House of Horror Commander":
      "img/set-symbols/duskmourn-commander.png",
    "Edge of Eternities": "img/set-symbols/EOE_expsym_m_3in.png",
    "Duskmourn: House of Horror": "img/set-symbols/duskmourn.png",
    "The Big Score": "img/set-symbols/big-score.png",
    Alpha: "img/set-symbols/double-masters.png",
  };
  return simbolosSet[nomeSet] || "img/set-symbols/double-masters.png";
}

// ============================================
// FUNÇÕES DE GERAÇÃO DE CONTEÚDO
// ============================================

function gerarCarrossel() {
  const cartasDestaque = cartas.filter(
    (carta) => carta.categoria === "Destaque"
  );
  const carrosselInner = document.querySelector(
    "#carrosselDestaque .carousel-inner"
  );
  const carrosselIndicadores = document.querySelector(
    "#carrosselDestaque .carousel-indicators"
  );

  if (!carrosselInner || !carrosselIndicadores) return;

  carrosselInner.innerHTML = "";
  carrosselIndicadores.innerHTML = "";

  cartasDestaque.forEach((carta, index) => {
    const slide = document.createElement("div");
    slide.className = `carousel-item${index === 0 ? " active" : ""}`;

    slide.innerHTML = `
      <div class="d-flex justify-content-center align-items-center h-100">
        <div class="card border-warning shadow-lg" style="max-width: 900px; width: 100%; cursor: pointer;" onclick="window.location.href='html/detalhes.html?id=${
          carta.id
        }&origem=destaque'">
          <div class="row g-0 h-100">
            <div class="col-md-4">
              <img src="${
                carta.imagem
              }" class="img-fluid rounded-start h-100" alt="${
      carta.nome
    }" style="object-fit: contain;">
            </div>
            <div class="col-md-8">
              <div class="card-body h-100 d-flex flex-column justify-content-between p-4">
                <h4 class="card-title text-warning fs-3 mb-3">${carta.nome}</h4>
                <p class="card-text fs-6 mb-3 text-justify">${carta.resumo}</p>
                
                <div class="row mb-3">
                  <div class="col-6">
                    <small class="text-muted">Tipo:</small><br>
                    <span class="fw-bold">${carta.descricao}</span>
                  </div>
                  <div class="col-6">
                    <small class="text-muted">Preço:</small><br>
                    <span class="text-success fs-5 fw-bold">${
                      carta.preco
                    }</span>
                  </div>
                </div>
                
                <div class="row mb-3">
                  <div class="col-6">
                    <small class="text-muted">Set:</small><br>
                    <div class="d-flex align-items-center mt-1">
                      <img src="${obterSimboloSet(carta.detalhes.set)}" alt="${
      carta.detalhes.set
    }" class="set-symbol-small me-2">
                      <span class="fw-bold">${carta.detalhes.set}</span>
                    </div>
                  </div>
                  <div class="col-6">
                    <small class="text-muted">Artista:</small><br>
                    <span class="fw-bold">${carta.detalhes.artista}</span>
                  </div>
                </div>
                
                <div class="row mb-3">
                  <div class="col-6">
                    <small class="text-muted">Cores:</small><br>
                    <div class="d-flex align-items-center mt-1">
                      ${carta.cores
                        .map((cor) => {
                          const simbolos = {
                            branco: "img/mana/W.svg",
                            azul: "img/mana/U.svg",
                            preto: "img/mana/B.svg",
                            vermelho: "img/mana/R.svg",
                            verde: "img/mana/G.svg",
                            incolor: "img/mana/C.svg",
                          };
                          return `<img src="${simbolos[cor]}" alt="${cor}" style="width: 20px; height: 20px; margin-right: 5px;">`;
                        })
                        .join("")}
                    </div>
                  </div>
                  <div class="col-6">
                    <small class="text-muted">Formatos Legais:</small><br>
                    <span class="fw-bold">${carta.detalhes.formato}</span>
                  </div>
                </div>
                
                <div class="d-flex justify-content-between align-items-center mt-auto">
                  <span class="badge ${obterClasseRaridade(
                    carta.raridade
                  )} text-dark fs-6 px-3 py-2">${carta.raridade}</span>
                  <small class="text-muted">📖 Clique para ver detalhes</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    carrosselInner.appendChild(slide);

    const indicador = document.createElement("button");
    indicador.type = "button";
    indicador.setAttribute("data-bs-target", "#carrosselDestaque");
    indicador.setAttribute("data-bs-slide-to", index.toString());
    indicador.className = index === 0 ? "active" : "";
    indicador.setAttribute("aria-current", index === 0 ? "true" : "false");
    indicador.setAttribute("aria-label", `Slide ${index + 1}`);

    carrosselIndicadores.appendChild(indicador);
  });

  const carrosselElement = document.getElementById("carrosselDestaque");
  if (carrosselElement) {
    carrosselElement.classList.add("carousel-fade");

    const carousel = new bootstrap.Carousel(carrosselElement, {
      interval: 5000,
      wrap: true,
      touch: true,
      pause: "hover",
    });

    carrosselElement.addEventListener("slide.bs.carousel", function (e) {
      const activeItem = carrosselElement.querySelector(
        ".carousel-item.active"
      );
      const nextItem = e.relatedTarget;

      if (activeItem && nextItem) {
        activeItem.style.zIndex = "1";
        nextItem.style.zIndex = "2";
      }
    });

    carrosselElement.addEventListener("slid.bs.carousel", function (e) {
      const items = carrosselElement.querySelectorAll(".carousel-item");
      items.forEach((item) => {
        item.style.zIndex = "";
      });
    });
  }
}

function gerarCardsBootstrap() {
  const containerCards = document.getElementById("container-cards");
  if (!containerCards) return;

  containerCards.innerHTML = "";

  cartas.forEach((carta) => {
    const cardCol = document.createElement("div");
    cardCol.className = "col-lg-3 col-md-4 col-sm-6 mb-4";

    cardCol.innerHTML = `
        <div class="card h-100 shadow border-warning card-hover" style="cursor: pointer;" onclick="window.location.href='html/detalhes.html?id=${
          carta.id
        }&origem=todas'">
        <div class="card-img-container" style="height: 300px; overflow: hidden; display: flex; align-items: center; justify-content: center; background-color: #f8f9fa;">
          <img src="${carta.imagem}" class="card-img-top" alt="${
      carta.nome
    }" style="max-height: 100%; max-width: 100%; object-fit: contain;">
        </div>
        <div class="card-body d-flex flex-column">
          <h5 class="card-title text-primary">${carta.nome}</h5>
          <p class="card-text text-muted small flex-grow-1">${carta.resumo}</p>
          <div class="d-flex justify-content-between align-items-center mt-auto">
            <span class="text-success fw-bold fs-6">${carta.preco}</span>
            <span class="badge ${obterClasseRaridade(
              carta.raridade
            )} text-dark">${carta.raridade}</span>
          </div>
        </div>
      </div>
    `;

    containerCards.appendChild(cardCol);
  });
}

async function gerarCards() {
  await carregarCartasDaAPI();
  gerarCarrossel();
  gerarCardsBootstrap();
}

// ============================================
// FUNÇÕES DE INTERATIVIDADE
// ============================================

function configurarBotoesMana() {
  const botoesMana = document.querySelectorAll(".filtro-mana");
  const containerCards = document.getElementById("container-cards");

  if (!containerCards) return;

  botoesMana.forEach((botao) => {
    botao.addEventListener("click", () => {
      const corSelecionada = botao.getAttribute("data-cor");

      botoesMana.forEach((b) => b.classList.remove("ativo"));
      botao.classList.add("ativo");

      let cartasFiltradas;
      if (corSelecionada === "todas") {
        cartasFiltradas = cartas;
      } else {
        cartasFiltradas = cartas.filter((carta) =>
          carta.cores.includes(corSelecionada)
        );
      }

      containerCards.innerHTML = "";
      cartasFiltradas.forEach((carta) => {
        const cardCol = document.createElement("div");
        cardCol.className = "col-lg-3 col-md-4 col-sm-6 mb-4";

        cardCol.innerHTML = `
            <div class="card h-100 shadow border-warning card-hover" style="cursor: pointer;" onclick="window.location.href='html/detalhes.html?id=${carta.id}&origem=todas'">
            <div class="card-img-container" style="height: 300px; overflow: hidden; display: flex; align-items: center; justify-content: center; background-color: #f8f9fa;">
              <img src="${carta.imagem}" class="card-img-top" alt="${carta.nome}" style="max-height: 100%; max-width: 100%; object-fit: contain;">
            </div>
            <div class="card-body d-flex flex-column">
              <h5 class="card-title text-primary">${carta.nome}</h5>
              <p class="card-text text-muted small flex-grow-1">${carta.resumo}</p>
              <div class="d-flex justify-content-between align-items-center mt-auto">
                <span class="text-success fw-bold fs-6">${carta.preco}</span>
                <span class="badge bg-secondary">${carta.raridade}</span>
              </div>
            </div>
          </div>
        `;

        containerCards.appendChild(cardCol);
      });
    });
  });
}

// ============================================
// INICIALIZAÇÃO DA APLICAÇÃO - PÁGINA PRINCIPAL
// ============================================

document.addEventListener("DOMContentLoaded", async () => {
  await gerarCards();
  configurarBotoesMana();
});
