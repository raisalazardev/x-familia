"use strict";

/* =====================================================================
   X FAMÍLIA — script principal
   1. Configurações  (EDITE AQUI: número do WhatsApp, taxa de entrega)
   2. Dados do cardápio
   3. Utilitários
   4. Carrossel
   5. Cardápio (busca, categorias e cards)
   6. Modal de produto (opções)
   7. Carrinho
   8. Pedido pelo WhatsApp
   9. Inicialização
===================================================================== */

/* =====================================================================
   1. CONFIGURAÇÕES
===================================================================== */

const CONFIG = {
  storeName: "X Família",

  // Número que RECEBE os pedidos: DDI + DDD + número, só dígitos.
  // Ex.: 55 (Brasil) + 62 (DDD) + 991003675
  whatsappNumber: "5562991003675",

  // Telefones exibidos no rodapé (display = como aparece; number = só dígitos).
  contactPhones: [
    { display: "(62) 99100-3675", number: "5562991003675" },
    { display: "(62) 99535-9565", number: "5562995359565" },
  ],

  // Taxa de entrega em reais (ex.: 5 ou 7.5).
  // Use null para "a combinar pelo WhatsApp" (nenhum valor é somado).
  deliveryFee: null,

  // Pedido a partir deste valor tem entrega grátis. null = desativado.
    freeDeliveryFrom: 0,

  // Horário de funcionamento (usa o horário de Brasília, não o do celular do cliente).
  // days: 0 = domingo ... 6 = sábado. Remova um número para fechar naquele dia.
  hours: {
    open: "18:00",
    close: "23:00",
    days: [0, 1, 2, 3, 4, 5, 6],
    timeZone: "America/Sao_Paulo",
  },

  // Troque o número (v1, v2...) se mudar a estrutura do carrinho salvo.
  storageKey: "xfamilia-cart-v1",

  maxQtyPerLine: 20,
};

/* =====================================================================
   2. DADOS DO CARDÁPIO
   Preços e ingredientes copiados do cardápio físico.
   - Foto de cada produto: img/produtos/<categoria>/<id>.jpg
   - options: grupos de escolha. type "single" (uma opção) ou "multi".
       Cada escolha pode ter price (valor extra em reais) — hoje todos 0.
   - removable: ingredientes que o cliente pode pedir "sem" (grátis).
===================================================================== */

const CATEGORIES = [
  { id: "sanduiches", label: "Sanduíches" },
  { id: "gourmet", label: "Gourmet" },
  { id: "porcoes", label: "Porções" },
  { id: "prato-feito", label: "Prato feito" },
  { id: "pasteis", label: "Pastéis" },
  { id: "sucos-cremes", label: "Sucos e cremes" },
  { id: "refrigerantes", label: "Refrigerantes" },
  { id: "cervejas", label: "Cervejas" },
];

const CATEGORY_NOTES = {
  pasteis: "Cada pastel leva até 3 sabores à sua escolha.",
  "sucos-cremes": "Escolha o sabor ao adicionar.",
  cervejas: "Venda proibida para menores de 18 anos.",
};

const FRUIT_FLAVORS = ["Abacaxi", "Cupuaçu", "Maracujá", "Morango"].map(
  (name) => ({ label: name, price: 0 }),
);

const PRODUCTS = [
  // ---------- Sanduíches ----------
  {
    id: "misto-quente",
    category: "sanduiches",
    name: "Misto Quente",
    price: 10,
    desc: "Pão, presunto, mussarela, tomate, alface.",
    removable: ["presunto", "mussarela", "tomate", "alface"],
  },
  {
    id: "americano",
    category: "sanduiches",
    name: "Americano",
    price: 15,
    desc: "Pão, presunto, mussarela, ovo, tomate, alface e abacaxi.",
    removable: ["presunto", "mussarela", "ovo", "tomate", "alface", "abacaxi"],
  },
  {
    id: "simples",
    category: "sanduiches",
    name: "Simples",
    price: 19,
    desc: "Pão, carne de hambúrguer, presunto, mussarela, salsicha, alface, tomate, milho, batata e molho.",
    removable: [
      "presunto",
      "mussarela",
      "salsicha",
      "alface",
      "tomate",
      "milho",
      "batata",
      "molho",
    ],
  },
  {
    id: "x-especial",
    category: "sanduiches",
    name: "X Especial",
    price: 20,
    desc: "Pão, carne de hambúrguer, presunto, mussarela, ovo, salsicha, alface, tomate, milho, abacaxi, batata e molho.",
    removable: [
      "presunto",
      "mussarela",
      "ovo",
      "salsicha",
      "alface",
      "tomate",
      "milho",
      "abacaxi",
      "batata",
      "molho",
    ],
  },
  {
    id: "x-bacon",
    category: "sanduiches",
    name: "X Bacon",
    price: 21,
    desc: "Pão, carne de hambúrguer, bacon, presunto, mussarela, salsicha, alface, tomate, milho, abacaxi, batata e molho.",
    removable: [
      "bacon",
      "presunto",
      "mussarela",
      "salsicha",
      "alface",
      "tomate",
      "milho",
      "abacaxi",
      "batata",
      "molho",
    ],
  },
  {
    id: "x-tudo",
    category: "sanduiches",
    name: "X Tudo",
    price: 23,
    desc: "Pão, carne de hambúrguer, bacon, presunto, mussarela, ovo, salsicha, alface, tomate, milho, batata e molho.",
    removable: [
      "bacon",
      "presunto",
      "mussarela",
      "ovo",
      "salsicha",
      "alface",
      "tomate",
      "milho",
      "batata",
      "molho",
    ],
  },

  // ---------- Sanduíches gourmet ----------
  {
    id: "x-burger",
    category: "gourmet",
    name: "X Burger",
    price: 23,
    desc: "Pão brioche, carne, cheddar, ovo, alface, tomate e molho verde.",
    removable: ["cheddar", "ovo", "alface", "tomate", "molho verde"],
  },
  {
    id: "x-familia",
    category: "gourmet",
    name: "X Família",
    price: 28,
    desc: "Pão brioche, 3 carnes de hambúrguer, bacon, cheddar, ovo, cebola, alface, tomate e molho verde.",
    removable: [
      "bacon",
      "cheddar",
      "ovo",
      "cebola",
      "alface",
      "tomate",
      "molho verde",
    ],
  },

  // ---------- Porções ----------
  {
    id: "batata-simples",
    category: "porcoes",
    name: "Batata Simples",
    price: 22,
    desc: "Porção de batata frita.",
  },
  {
    id: "batata-especial",
    category: "porcoes",
    name: "Batata Especial",
    price: 25,
    desc: "Batata, bacon crocante e cheddar cremoso.",
  },
  {
    id: "calabresa-acebolada",
    category: "porcoes",
    name: "Calabresa Acebolada",
    price: 25,
    desc: "Porção de calabresa acebolada.",
  },
  {
    id: "tilapia",
    category: "porcoes",
    name: "Tilápia",
    price: 35,
    desc: "400g de tilápia.",
  },

  // ---------- Prato feito ----------
  {
    id: "prato-feito",
    category: "prato-feito",
    name: "Prato Feito",
    price: 22,
    desc: "Arroz, feijão, batata frita, ovo, salada e bife ou frango.",
    options: [
      {
        type: "single",
        label: "Escolha a carne",
        required: true,
        choices: [
          { label: "Bife", price: 0 },
          { label: "Frango", price: 0 },
        ],
      },
    ],
  },

  // ---------- Pastéis ----------
  {
    id: "pastel",
    category: "pasteis",
    name: "Pastel",
    price: 10,
    desc: "Pastel com até 3 sabores à sua escolha.",
    options: [
      {
        type: "multi",
        label: "Sabores",
        required: true,
        min: 1,
        max: 3,
        choices: [
          "Frango",
          "Carne",
          "Bacon",
          "Calabresa",
          "Catupiry",
          "Cheddar",
          "Pizza",
          "Batata",
          "Presunto",
          "Mussarela",
        ].map((name) => ({ label: name, price: 0 })),
      },
      {
        type: "multi",
        label: "Acompanhamentos",
        required: false,
        choices: [
          { label: "Molho", price: 0 },
          { label: "Vinagrete", price: 0 },
        ],
      },
    ],
  },

  // ---------- Sucos e cremes ----------
  {
    id: "suco",
    category: "sucos-cremes",
    name: "Suco",
    price: 6,
    desc: "Suco natural. Sabores: abacaxi, cupuaçu, maracujá e morango.",
    options: [
      {
        type: "single",
        label: "Sabor",
        required: true,
        choices: FRUIT_FLAVORS,
      },
    ],
  },
  {
    id: "creme",
    category: "sucos-cremes",
    name: "Creme",
    price: 10,
    desc: "Creme cremoso. Sabores: abacaxi, cupuaçu, maracujá e morango.",
    options: [
      {
        type: "single",
        label: "Sabor",
        required: true,
        choices: FRUIT_FLAVORS,
      },
    ],
  },

  // ---------- Refrigerantes ----------
  {
    id: "coca-cola-lata",
    category: "refrigerantes",
    name: "Coca-Cola Lata",
    price: 6,
    desc: "Lata 350ml.",
  },
  {
    id: "guarana-lata",
    category: "refrigerantes",
    name: "Guaraná Lata",
    price: 6,
    desc: "Lata 350ml.",
  },
  {
    id: "fanta-lata",
    category: "refrigerantes",
    name: "Fanta Lata",
    price: 6,
    desc: "Lata 350ml.",
  },
  {
    id: "coca-cola-600ml",
    category: "refrigerantes",
    name: "Coca-Cola 600ml",
    price: 7,
    desc: "Garrafa 600ml.",
  },
  {
    id: "coca-cola-1l",
    category: "refrigerantes",
    name: "Coca-Cola 1 L",
    price: 10,
    desc: "Garrafa 1 litro.",
  },
  {
    id: "guarana-1l",
    category: "refrigerantes",
    name: "Guaraná 1 L",
    price: 10,
    desc: "Garrafa 1 litro.",
  },
  {
    id: "coca-cola-2l",
    category: "refrigerantes",
    name: "Coca-Cola 2 L",
    price: 13,
    desc: "Garrafa 2 litros.",
  },
  {
    id: "fanta-2l",
    category: "refrigerantes",
    name: "Fanta 2 L",
    price: 13,
    desc: "Garrafa 2 litros.",
  },
  {
    id: "guarana-2l",
    category: "refrigerantes",
    name: "Guaraná 2 L",
    price: 13,
    desc: "Garrafa 2 litros.",
  },

  // ---------- Cervejas ----------
  {
    id: "antarctica",
    category: "cervejas",
    name: "Antarctica",
    price: 5,
    desc: "Lata 350ml.",
  },
  {
    id: "antarctica-original",
    category: "cervejas",
    name: "Antarctica Original",
    price: 5,
    desc: "Lata 350ml.",
  },
  {
    id: "brahma",
    category: "cervejas",
    name: "Brahma",
    price: 5,
    desc: "Lata 350ml.",
  },
  {
    id: "heineken",
    category: "cervejas",
    name: "Heineken",
    price: 9,
    desc: "Lata 350ml.",
  },
  {
    id: "sol",
    category: "cervejas",
    name: "Sol",
    price: 9,
    desc: "Lata 350ml.",
  },
];

const PLACEHOLDER_IMG = "./img/placeholder.svg";
const imagePath = (product) =>
  `./img/produtos/${product.category}/${product.id}.jpg`;

/* =====================================================================
   3. UTILITÁRIOS
===================================================================== */

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const moneyFormat = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
const money = (value) => moneyFormat.format(value);

const escapeHTML = (text) =>
  String(text).replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char],
  );

const normalize = (text) =>
  String(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const findProduct = (id) => PRODUCTS.find((product) => product.id === id);

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

/* Abre/fecha <dialog> bloqueando a rolagem da página */
function openDialog(dialog) {
  if (typeof dialog.showModal !== "function") return;
  dialog.showModal();
  document.body.classList.add("no-scroll");
}

function initDialog(dialog) {
  dialog.addEventListener("close", () => {
    if (!$("dialog[open]")) document.body.classList.remove("no-scroll");
  });

  dialog.addEventListener("click", (event) => {
    // clique no fundo escurecido ou em qualquer [data-close]
    if (event.target === dialog || event.target.closest("[data-close]"))
      dialog.close();
  });
}

/* =====================================================================
   3.1 HORÁRIO DE FUNCIONAMENTO
===================================================================== */

const WEEKDAYS = [
  "domingo",
  "segunda-feira",
  "terça-feira",
  "quarta-feira",
  "quinta-feira",
  "sexta-feira",
  "sábado",
];
const WEEKDAY_INDEX = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

const toMinutes = (time) => {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
};

/* "18:00" → "18h" | "18:30" → "18h30" */
const formatHour = (time) => {
  const [hour, minute] = time.split(":");
  return minute === "00" ? `${Number(hour)}h` : `${Number(hour)}h${minute}`;
};

function getOpenStatus() {
  const { open, close, days, timeZone } = CONFIG.hours;

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (type) => parts.find((part) => part.type === type).value;

  const weekday = WEEKDAY_INDEX[get("weekday")];
  const minutes = Number(get("hour")) * 60 + Number(get("minute"));

  const isOpen =
    days.includes(weekday) &&
    minutes >= toMinutes(open) &&
    minutes < toMinutes(close);
  if (isOpen) {
    return {
      isOpen,
      text: `Aberto agora • fechamos às ${formatHour(close)}`,
      closedMessage: "",
    };
  }

  // Próxima abertura
  let when = "";
  if (days.includes(weekday) && minutes < toMinutes(open)) {
    when = "hoje";
  } else {
    for (let offset = 1; offset <= 7; offset += 1) {
      const day = (weekday + offset) % 7;
      if (days.includes(day)) {
        when =
          offset === 1
            ? "amanhã"
            : `na ${WEEKDAYS[day]}`
                .replace("na domingo", "no domingo")
                .replace("na sábado", "no sábado");
        break;
      }
    }
  }

  const next = when
    ? `abrimos ${when} às ${formatHour(open)}`
    : "sem previsão de abertura";
  return {
    isOpen,
    text: `Fechado agora • ${next}`,
    closedMessage: `Estamos fechados agora (${next}). Você pode montar o pedido e enviar: respondemos assim que abrirmos.`,
  };
}

function renderOpenStatus() {
  const status = getOpenStatus();

  const badge = $("#open-status");
  badge.classList.toggle("is-open", status.isOpen);
  badge.classList.toggle("is-closed", !status.isOpen);
  $("#open-status-text").textContent = status.text;

  const notice = $("#closed-notice");
  notice.textContent = status.closedMessage;
  notice.hidden = status.isOpen;
}

function initOpenStatus() {
  const { open, close } = CONFIG.hours;
  $("#footer-hours").textContent =
    `Funcionamento: das ${formatHour(open)} às ${formatHour(close)}`;

  renderOpenStatus();
  setInterval(renderOpenStatus, 60 * 1000);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) renderOpenStatus();
  });
}

/* =====================================================================
   4. CARROSSEL
===================================================================== */

function initCarousel() {
  const slides = $$(".carousel .item");
  if (slides.length < 2) return;

  const carousel = $(".carousel");
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const AUTOPLAY_MS = 6000;

  let index = 0;
  let timer = null;

  function show(next) {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const active = i === index;
      slide.classList.toggle("active", active);
      slide.setAttribute("aria-hidden", String(!active));
    });
  }

  const stop = () => {
    clearInterval(timer);
    timer = null;
  };
  const start = () => {
    if (reduceMotion || timer) return;
    timer = setInterval(() => show(index + 1), AUTOPLAY_MS);
  };
  const restart = () => {
    stop();
    start();
  };

  $("#prev").addEventListener("click", () => {
    show(index - 1);
    restart();
  });
  $("#next").addEventListener("click", () => {
    show(index + 1);
    restart();
  });

  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      show(index - 1);
      restart();
    }
    if (event.key === "ArrowRight") {
      show(index + 1);
      restart();
    }
  });

  // Deslizar com o dedo
  let touchX = null;
  carousel.addEventListener(
    "touchstart",
    (event) => {
      touchX = event.touches[0].clientX;
    },
    { passive: true },
  );
  carousel.addEventListener(
    "touchend",
    (event) => {
      if (touchX === null) return;
      const delta = event.changedTouches[0].clientX - touchX;
      touchX = null;
      if (Math.abs(delta) > 50) {
        show(index + (delta < 0 ? 1 : -1));
        restart();
      }
    },
    { passive: true },
  );

  // Pausa quando o mouse/foco está no carrossel ou a aba fica oculta
  carousel.addEventListener("mouseenter", stop);
  carousel.addEventListener("mouseleave", start);
  carousel.addEventListener("focusin", stop);
  carousel.addEventListener("focusout", start);
  document.addEventListener("visibilitychange", () =>
    document.hidden ? stop() : start(),
  );

  start();
}

/* =====================================================================
   5. CARDÁPIO
===================================================================== */

const menuState = { category: "all", query: "" };

function renderCategoryNav() {
  const list = $("#category-nav");
  const items = [{ id: "all", label: "Todos" }, ...CATEGORIES];

  list.innerHTML = items
    .map(
      (cat) => `
    <li>
      <button type="button" class="cat-btn" data-category="${cat.id}"
        aria-pressed="${menuState.category === cat.id}">${escapeHTML(cat.label)}</button>
    </li>`,
    )
    .join("");
}

function productCardHTML(product) {
  return `
    <li>
      <article class="product-card">
        <div class="product-media">
          <img src="${imagePath(product)}" alt="${escapeHTML(product.name)}"
            width="400" height="300" loading="lazy" decoding="async">
        </div>
        <div class="product-body">
          <h4 class="product-name">${escapeHTML(product.name)}</h4>
          <p class="product-desc">${escapeHTML(product.desc)}</p>
          <div class="product-footer">
            <span class="product-price">${money(product.price)}</span>
            <button type="button" class="btn-add" data-add="${product.id}"
              aria-label="Adicionar ${escapeHTML(product.name)} ao carrinho">Adicionar</button>
          </div>
        </div>
      </article>
    </li>`;
}

function renderMenu() {
  const query = normalize(menuState.query.trim());
  let html = "";
  let total = 0;

  CATEGORIES.forEach((cat) => {
    if (menuState.category !== "all" && menuState.category !== cat.id) return;

    const items = PRODUCTS.filter(
      (product) =>
        product.category === cat.id &&
        (!query ||
          normalize(`${product.name} ${product.desc}`).includes(query)),
    );
    if (!items.length) return;

    total += items.length;
    const note = CATEGORY_NOTES[cat.id];

    html += `
      <section class="menu-section" aria-labelledby="sec-${cat.id}">
        <h3 class="menu-section-title" id="sec-${cat.id}">${escapeHTML(cat.label)}</h3>
        ${note ? `<p class="menu-section-note">${escapeHTML(note)}</p>` : ""}
        <ul class="product-grid">${items.map(productCardHTML).join("")}</ul>
      </section>`;
  });

  $("#menu-content").innerHTML = html;
  $("#menu-empty").hidden = total > 0;
  $("#menu-status").textContent =
    total > 0
      ? `${total} ${total === 1 ? "item encontrado" : "itens encontrados"}`
      : "Nenhum item encontrado";
  $("#search-clear").hidden = !menuState.query;
}

function resetMenuFilters() {
  menuState.category = "all";
  menuState.query = "";
  $("#menu-search").value = "";
  renderCategoryNav();
  renderMenu();
}

function initMenu() {
  renderCategoryNav();
  renderMenu();

  $("#category-nav").addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    menuState.category = button.dataset.category;
    menuState.query = ""; // escolher categoria limpa a busca
    $("#menu-search").value = "";
    renderCategoryNav();
    renderMenu();
    $("#menu-content").scrollIntoView({ block: "start", behavior: "smooth" });
  });

  let searchTimer;
  $("#menu-search").addEventListener("input", (event) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      menuState.query = event.target.value;
      // A busca vale para o cardápio inteiro, não só para a categoria aberta
      if (menuState.query.trim() && menuState.category !== "all") {
        menuState.category = "all";
        renderCategoryNav();
      }
      renderMenu();
    }, 150);
  });

  $("#search-clear").addEventListener("click", () => {
    menuState.query = "";
    $("#menu-search").value = "";
    renderMenu();
    $("#menu-search").focus();
  });

  $("#empty-reset").addEventListener("click", resetMenuFilters);

  // Clique em "Adicionar"
  $("#menu-content").addEventListener("click", (event) => {
    const button = event.target.closest("[data-add]");
    if (button) handleAdd(button.dataset.add);
  });

  // Foto não encontrada → imagem padrão (erros de <img> não "borbulham": usa captura)
  $("#menu-content").addEventListener(
    "error",
    (event) => {
      const img = event.target;
      if (img.tagName !== "IMG" || img.classList.contains("is-placeholder"))
        return;
      img.classList.add("is-placeholder");
      img.src = PLACEHOLDER_IMG;
    },
    true,
  );
}

/* =====================================================================
   6. MODAL DE PRODUTO (OPÇÕES)
===================================================================== */

const hasCustomization = (product) =>
  Boolean(
    (product.options && product.options.length) ||
    (product.removable && product.removable.length),
  );

const productState = { product: null, qty: 1 };

function handleAdd(productId) {
  const product = findProduct(productId);
  if (!product) return;

  if (!hasCustomization(product)) {
    addToCart(product, { details: [], extra: 0, note: "" }, 1);
    return;
  }

  productState.product = product;
  productState.qty = 1;
  renderProductDialog();
  openDialog($("#product-dialog"));
}

function renderProductDialog() {
  const { product } = productState;
  $("#product-title").textContent = product.name;

  let html = `<p class="modal-desc">${escapeHTML(product.desc)}</p>`;

  (product.options || []).forEach((group, g) => {
    const type = group.type === "single" ? "radio" : "checkbox";
    const hint =
      group.type === "single"
        ? group.required
          ? "obrigatório"
          : "opcional"
        : `${group.required ? "obrigatório" : "opcional"}${group.max ? `, até ${group.max}` : ""}`;

    html += `
      <fieldset class="opt-group" data-group="${g}">
        <legend>${escapeHTML(group.label)} <span class="legend-hint">(${hint})</span></legend>
        ${group.choices
          .map(
            (choice, c) => `
          <label class="choice">
            <input type="${type}" name="group-${g}" value="${c}">
            <span>${escapeHTML(choice.label)}</span>
            ${choice.price ? `<small>+ ${money(choice.price)}</small>` : ""}
          </label>`,
          )
          .join("")}
      </fieldset>`;
  });

  if (product.removable && product.removable.length) {
    html += `
      <fieldset class="opt-group" data-group="removable">
        <legend>Retirar ingredientes <span class="legend-hint">(opcional)</span></legend>
        ${product.removable
          .map(
            (item, r) => `
          <label class="choice">
            <input type="checkbox" name="removable" value="${r}">
            <span>Sem ${escapeHTML(item)}</span>
          </label>`,
          )
          .join("")}
      </fieldset>`;
  }

  html += `
    <div class="field">
      <label for="item-note">Observação do item (opcional)</label>
      <input type="text" id="item-note" maxlength="100" placeholder="Ex.: carne bem passada">
    </div>
    <p class="form-error" id="product-error" role="alert" hidden></p>`;

  $("#product-body").innerHTML = html;

  $("#product-footer").innerHTML = `
    <div class="stepper" role="group" aria-label="Quantidade">
      <button type="button" data-qty="-1" aria-label="Diminuir quantidade">&minus;</button>
      <output id="product-qty" aria-live="polite">1</output>
      <button type="button" data-qty="1" aria-label="Aumentar quantidade">+</button>
    </div>
    <button type="button" class="btn-primary" id="product-confirm"></button>`;

  updateProductTotal();
}

/* Lê o que o cliente marcou no modal */
function readProductSelection() {
  const { product } = productState;
  const details = [];
  let extra = 0;
  let error = "";

  (product.options || []).forEach((group, g) => {
    const checked = $$(`input[name="group-${g}"]:checked`, $("#product-body"));
    const labels = checked.map((input) => group.choices[Number(input.value)]);
    extra += labels.reduce((sum, choice) => sum + (choice.price || 0), 0);

    const min = group.min ?? (group.required ? 1 : 0);
    if (labels.length < min && !error) {
      error =
        group.type === "single"
          ? `Escolha uma opção em "${group.label}".`
          : `Escolha pelo menos ${min} em "${group.label}".`;
    }
    if (labels.length)
      details.push(
        `${group.label}: ${labels.map((choice) => choice.label).join(", ")}`,
      );
  });

  const removed = $$('input[name="removable"]:checked', $("#product-body")).map(
    (input) => product.removable[Number(input.value)],
  );
  if (removed.length) details.push(`Sem: ${removed.join(", ")}`);

  return { details, extra, note: ($("#item-note")?.value || "").trim(), error };
}

function updateProductTotal() {
  const { product, qty } = productState;
  const { extra } = readProductSelection();
  $("#product-qty").textContent = qty;
  $("#product-confirm").textContent =
    `Adicionar • ${money((product.price + extra) * qty)}`;
}

function initProductDialog() {
  const dialog = $("#product-dialog");
  initDialog(dialog);

  dialog.addEventListener("change", (event) => {
    const input = event.target;
    if (input.matches('input[type="checkbox"][name^="group-"]')) {
      const g = Number(input.name.replace("group-", ""));
      const group = productState.product.options[g];
      const checkedCount = $$(
        `input[name="${input.name}"]:checked`,
        dialog,
      ).length;
      if (group.max && checkedCount > group.max) {
        input.checked = false;
        showProductError(
          `Você pode escolher até ${group.max} em "${group.label}".`,
        );
        return;
      }
    }
    showProductError("");
    updateProductTotal();
  });

  dialog.addEventListener("click", (event) => {
    const qtyButton = event.target.closest("[data-qty]");
    if (qtyButton) {
      productState.qty = Math.min(
        CONFIG.maxQtyPerLine,
        Math.max(1, productState.qty + Number(qtyButton.dataset.qty)),
      );
      updateProductTotal();
      return;
    }

    if (event.target.closest("#product-confirm")) {
      const selection = readProductSelection();
      if (selection.error) {
        showProductError(selection.error);
        return;
      }
      addToCart(productState.product, selection, productState.qty);
      dialog.close();
    }
  });
}

function showProductError(message) {
  const box = $("#product-error");
  if (!box) return;
  box.textContent = message;
  box.hidden = !message;
}

/* =====================================================================
   7. CARRINHO
   Cada linha: { id, extra, details[], note, qty }
   O preço unitário é sempre recalculado: preço do produto + extra.
===================================================================== */

let cart = loadCart();

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CONFIG.storageKey) || "[]");
    if (!Array.isArray(saved)) return [];
    return saved
      .filter(
        (line) =>
          line &&
          findProduct(line.id) &&
          Number.isInteger(line.qty) &&
          line.qty > 0 &&
          Array.isArray(line.details) &&
          Number.isFinite(line.extra),
      )
      .map((line) => ({
        id: line.id,
        extra: line.extra,
        details: line.details.map(String),
        note: String(line.note || ""),
        qty: Math.min(line.qty, CONFIG.maxQtyPerLine),
      }));
  } catch (error) {
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(CONFIG.storageKey, JSON.stringify(cart));
  } catch (error) {
    /* sem armazenamento disponível: o carrinho funciona só nesta visita */
  }
}

const unitPrice = (line) => findProduct(line.id).price + line.extra;
const lineKey = (line) =>
  `${line.id}|${line.extra}|${line.details.join(";")}|${line.note}`;
const cartCount = () => cart.reduce((sum, line) => sum + line.qty, 0);
const cartSubtotal = () =>
  cart.reduce((sum, line) => sum + unitPrice(line) * line.qty, 0);

function addToCart(product, selection, qty) {
  const newLine = {
    id: product.id,
    extra: selection.extra,
    details: selection.details,
    note: selection.note,
    qty,
  };

  const existing = cart.find((line) => lineKey(line) === lineKey(newLine));
  if (existing) {
    existing.qty = Math.min(CONFIG.maxQtyPerLine, existing.qty + qty);
  } else {
    cart.push(newLine);
  }

  updateCartUI();
  showToast(`${product.name} adicionado ao carrinho`);

  const fab = $("#cart-fab");
  fab.classList.remove("bump");
  void fab.offsetWidth; // reinicia a animação
  fab.classList.add("bump");
}

/* Entrega: retorna { mode, fee (número ou null), label } */
function getDelivery(subtotal) {
  const mode = $('input[name="order-mode"]:checked').value;
  if (mode === "retirada") return { mode, fee: 0, label: "Retirada no local" };

  const free =
    CONFIG.freeDeliveryFrom !== null && subtotal >= CONFIG.freeDeliveryFrom;
  if (free) return { mode, fee: 0, label: "Grátis" };
  if (typeof CONFIG.deliveryFee === "number")
    return { mode, fee: CONFIG.deliveryFee, label: money(CONFIG.deliveryFee) };
  return { mode, fee: null, label: "A combinar" };
}

function getTotals() {
  const subtotal = cartSubtotal();
  const delivery = getDelivery(subtotal);
  const total = subtotal + (delivery.fee || 0);
  return { subtotal, delivery, total };
}

function updateCartUI() {
  saveCart();

  const count = cartCount();
  const { subtotal, delivery, total } = getTotals();

  // Barra flutuante
  const fab = $("#cart-fab");
  fab.hidden = count === 0;
  $("#cart-fab-count").textContent = count;
  $("#cart-fab-label").textContent =
    count === 1 ? "Ver carrinho (1 item)" : `Ver carrinho (${count} itens)`;
  $("#cart-fab-total").textContent = money(subtotal);

  // Lista de itens
  $("#cart-empty").hidden = count > 0;
  $("#cart-form").hidden = count === 0;
  $("#cart-summary").hidden = count === 0;
  $(".modal-footer-cart").hidden = count === 0;

  $("#cart-items").innerHTML = cart
    .map((line, i) => {
      const product = findProduct(line.id);
      const details = [
        ...line.details,
        ...(line.note ? [`Obs.: ${line.note}`] : []),
      ];
      return `
      <li class="cart-line">
        <div>
          <div class="cart-line-name">${escapeHTML(product.name)}</div>
          ${details.length ? `<ul class="cart-line-details">${details.map((d) => `<li>${escapeHTML(d)}</li>`).join("")}</ul>` : ""}
        </div>
        <div class="cart-line-total">${money(unitPrice(line) * line.qty)}</div>
        <div class="cart-line-actions">
          <div class="stepper" role="group" aria-label="Quantidade de ${escapeHTML(product.name)}">
            <button type="button" data-cart="dec" data-index="${i}" aria-label="Diminuir quantidade">&minus;</button>
            <output>${line.qty}</output>
            <button type="button" data-cart="inc" data-index="${i}" aria-label="Aumentar quantidade">+</button>
          </div>
          <button type="button" class="cart-remove" data-cart="remove" data-index="${i}"
            aria-label="Remover ${escapeHTML(product.name)}">Remover</button>
        </div>
      </li>`;
    })
    .join("");

  // Resumo de valores
  const feePending = delivery.mode === "entrega" && delivery.fee === null;
  $("#cart-summary").innerHTML = `
    <div><dt>Subtotal</dt><dd>${money(subtotal)}</dd></div>
    <div><dt>Entrega</dt><dd>${escapeHTML(delivery.label)}</dd></div>
    <div class="total"><dt>${feePending ? "Total estimado (sem entrega)" : "Total estimado"}</dt><dd>${money(total)}</dd></div>
    <p class="cart-summary-note">${
      feePending
        ? "A taxa de entrega será confirmada pelo WhatsApp."
        : "Valor sujeito a confirmação pelo estabelecimento."
    }</p>`;

  $("#address-field").hidden = delivery.mode !== "entrega";
}

function showCartError(message) {
  const box = $("#cart-error");
  box.textContent = message;
  box.hidden = !message;
}

function initCart() {
  const dialog = $("#cart-dialog");
  initDialog(dialog);

  $("#cart-fab").addEventListener("click", () => {
    showCartError("");
    openDialog(dialog);
  });

  $("#cart-items").addEventListener("click", (event) => {
    const button = event.target.closest("[data-cart]");
    if (!button) return;

    const line = cart[Number(button.dataset.index)];
    if (!line) return;

    const action = button.dataset.cart;
    if (action === "inc")
      line.qty = Math.min(CONFIG.maxQtyPerLine, line.qty + 1);
    if (action === "dec") line.qty -= 1;
    if (action === "remove" || line.qty <= 0)
      cart.splice(Number(button.dataset.index), 1);

    updateCartUI();
  });

  $$('input[name="order-mode"]').forEach((radio) =>
    radio.addEventListener("change", () => {
      showCartError("");
      updateCartUI();
    }),
  );

  $("#btn-clear").addEventListener("click", () => {
    if (!window.confirm("Esvaziar o carrinho?")) return;
    cart = [];
    updateCartUI();
  });

  $("#btn-checkout").addEventListener("click", checkoutWhatsApp);
}

/* =====================================================================
   8. PEDIDO PELO WHATSAPP
===================================================================== */

function buildWhatsAppMessage() {
  const { subtotal, delivery, total } = getTotals();
  const name = $("#customer-name").value.trim();
  const address = $("#customer-address").value.trim();
  const payment = $("#payment-method").value;
  const note = $("#order-note").value.trim();

  const lines = [
    `NOVO PEDIDO — ${CONFIG.storeName.toUpperCase()}`,
    "",
    "ITENS DO PEDIDO",
  ];

  cart.forEach((line) => {
    const product = findProduct(line.id);
    lines.push(
      `${line.qty}x ${product.name} — ${money(unitPrice(line) * line.qty)}`,
    );
    line.details.forEach((detail) => lines.push(`   • ${detail}`));
    if (line.note) lines.push(`   • Obs.: ${line.note}`);
  });

  lines.push("", `Subtotal: ${money(subtotal)}`);

  if (delivery.mode === "entrega") {
    lines.push(`Entrega: ${delivery.label}`);
  }

  lines.push(
    delivery.mode === "entrega" && delivery.fee === null
      ? `Total estimado (sem entrega): ${money(total)}`
      : `Total estimado: ${money(total)}`,
  );

  lines.push("", `Cliente: ${name}`);
  lines.push(
    `Recebimento: ${delivery.mode === "entrega" ? "Entrega" : "Retirada no local"}`,
  );
  if (delivery.mode === "entrega") lines.push(`Endereço: ${address}`);
  lines.push(`Pagamento: ${payment || "A combinar"}`);
  if (note) lines.push(`Observações: ${note}`);

  lines.push("", "Pedido feito pelo site. Aguardo a confirmação!");
  return lines.join("\n");
}

function finishOrder() {
  cart = [];
  updateCartUI();
  $("#order-note").value = "";
  showCartError("");
  $("#cart-dialog").close();
  showToast("WhatsApp aberto! Envie a mensagem para concluir o pedido.");
 }

function checkoutWhatsApp() {
  showCartError("");

  if (!cart.length) {
    showCartError("Adicione pelo menos um item ao carrinho.");
    return;
  }

  const nameInput = $("#customer-name");
  const addressInput = $("#customer-address");
  const isDelivery = $('input[name="order-mode"]:checked').value === "entrega";

  if (!nameInput.value.trim()) {
    showCartError("Informe seu nome para continuar.");
    nameInput.focus();
    return;
  }

  if (isDelivery && !addressInput.value.trim()) {
    showCartError(
      'Informe o endereço de entrega ou escolha "Retirar no local".',
    );
    addressInput.focus();
    return;
  }

   const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(buildWhatsAppMessage())}`;
  const opened = window.open(url, "_blank");

  if (opened) {
    opened.opener = null; // mantém a segurança do noopener
  } else {
    // Só se o navegador bloquear a nova aba, abre na mesma janela
    window.location.href = url;
  }

  finishOrder();
}

/* =====================================================================
   9. INICIALIZAÇÃO
===================================================================== */

function initFooter() {
  $("#current-year").textContent = new Date().getFullYear();

  $("#footer-phones").innerHTML = CONFIG.contactPhones
    .map(
      (phone) => `
    <li>
      <a href="https://wa.me/${phone.number}" target="_blank" rel="noopener noreferrer">${escapeHTML(phone.display)}</a>
    </li>`,
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  initCarousel();
  initMenu();
  initProductDialog();
  initCart();
  initFooter();
  initOpenStatus();
  updateCartUI();
});
