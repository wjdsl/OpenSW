let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

let users = JSON.parse(localStorage.getItem("users")) || [
  {
    name: "Test User",
    email: "test@example.com",
    id: "test",
    password: "1234"
  }
];

let tickets = JSON.parse(localStorage.getItem("tickets")) || [
  {
    id: 1,
    title: "Cortis Concert",
    performanceDate: "2026-09-02",
    performanceTime: "16:00",
    seat: "C구역 4열 9번",
    price: 140000,
    tradeMethod: "Online Transfer",
    description: "예매 내역서와 티켓 정보를 확인한 후 거래 가능합니다.",
    sellerId: "test",
    sellerName: "Test User",
    ticketStatus: "Available"
  },
  {
    id: 2,
    title: "SHINee Concert",
    performanceDate: "2026-07-20",
    performanceTime: "17:00",
    seat: "B구역 9열 8번",
    price: 120000,
    tradeMethod: "Direct Trade",
    description: "예매 내역서와 티켓 정보를 확인한 후 거래 가능합니다.",
    sellerId: "test",
    sellerName: "Test User",
    ticketStatus: "Available"
  },
  {
    id: 3,
    title: "Musical Rent",
    performanceDate: "2026-08-05",
    performanceTime: "20:00",
    seat: "VIP석 1층 B열",
    price: 95000,
    tradeMethod: "Online Transfer",
    description: "모바일 티켓 양도 가능합니다. 거래 요청 후 상세 정보를 안내합니다.",
    sellerId: "test",
    sellerName: "Test User",
    ticketStatus: "Available"
  },
  {
    id: 4,
    title: "Baseball Match",
    performanceDate: "2026-06-30",
    performanceTime: "18:30",
    seat: "중앙석 204구역",
    price: 55000,
    tradeMethod: "Direct Trade",
    description: "경기 당일 관람이 어려워져 등록합니다.",
    sellerId: "test",
    sellerName: "Test User",
    ticketStatus: "Available"
  },
  {
    id: 5,
    title: "Hamlet Theater",
    performanceDate: "2026-07-12",
    performanceTime: "17:00",
    seat: "B열 8번",
    price: 45000,
    tradeMethod: "Negotiation",
    description: "연극 티켓입니다. 가격 협의 가능합니다.",
    sellerId: "test",
    sellerName: "Test User",
    ticketStatus: "Available"
  }
];

let trades = JSON.parse(localStorage.getItem("trades")) || [];
let reports = JSON.parse(localStorage.getItem("reports")) || [];
let selectedReportTicketId = null;

function saveData() {
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("tickets", JSON.stringify(tickets));
  localStorage.setItem("trades", JSON.stringify(trades));
  localStorage.setItem("reports", JSON.stringify(reports));

  if (currentUser) {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }
}

function showPage(pageId) {
  const pages = document.querySelectorAll(".page");

  pages.forEach(function(page) {
    page.classList.remove("active");
  });

  document.getElementById(pageId).classList.add("active");

  if (pageId === "home") {
    renderRecentTickets();
  }

  if (pageId === "ticketList") {
    renderTicketList();
  }

  if (pageId === "tradeStatus") {
    renderTradeStatus();
  }

  if (pageId === "myPage") {
    renderMyPage();
  }

  window.scrollTo(0, 0);
}

function updateAuthArea() {
  const authArea = document.getElementById("authArea");

  if (currentUser) {
    authArea.innerHTML = `
      <span class="login-name">${currentUser.name}</span>
      <button class="outline-btn" onclick="logout()">Logout</button>
    `;
  } else {
    authArea.innerHTML = `
      <button class="outline-btn" onclick="showPage('login')">Login</button>
      <button class="main-btn small" onclick="showPage('signup')">Sign Up</button>
    `;
  }
}

function signup() {
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const id = document.getElementById("signupId").value.trim();
  const password = document.getElementById("signupPassword").value.trim();

  if (!name || !email || !id || !password) {
    alert("모든 회원가입 정보를 입력해주세요.");
    return;
  }

  const duplicatedUser = users.find(function(user) {
    return user.id === id || user.email === email;
  });

  if (duplicatedUser) {
    alert("이미 사용 중인 ID 또는 이메일입니다.");
    return;
  }

  const newUser = {
    name: name,
    email: email,
    id: id,
    password: password
  };

  users.push(newUser);
  currentUser = newUser;
  saveData();
  updateAuthArea();

  alert("회원가입이 완료되었습니다.");
  showPage("home");
}

function login() {
  const id = document.getElementById("loginId").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!id || !password) {
    alert("ID와 비밀번호를 입력해주세요.");
    return;
  }

  const user = users.find(function(item) {
    return item.id === id && item.password === password;
  });

  if (!user) {
    alert("ID 또는 비밀번호가 올바르지 않습니다.");
    return;
  }

  currentUser = user;
  saveData();
  updateAuthArea();

  alert("로그인되었습니다.");
  showPage("home");
}

function logout() {
  currentUser = null;
  localStorage.removeItem("currentUser");
  updateAuthArea();
  renderMyPage();
  alert("로그아웃되었습니다.");
  showPage("home");
}

function formatPrice(price) {
  return Number(price).toLocaleString("ko-KR") + "원";
}

function createTicketCard(ticket) {
  return `
    <div class="ticket-card">
      <div class="ticket-visual">
        <span class="status-badge">${ticket.ticketStatus}</span>
        <div class="ticket-visual-title">${ticket.title}</div>
      </div>

      <div class="ticket-body">
        <h3>${ticket.title}</h3>

        <div class="ticket-info">
          <div>📅 ${ticket.performanceDate} · ${ticket.performanceTime}</div>
          <div>💺 ${ticket.seat}</div>
          <div>🔁 ${ticket.tradeMethod}</div>
          <div>👤 Seller: ${ticket.sellerName}</div>
        </div>

        <div class="ticket-price">${formatPrice(ticket.price)}</div>

        <div class="ticket-actions">
          <button class="detail-btn" onclick="showTicketDetail(${ticket.id})">Detail</button>
          <button class="request-btn" onclick="requestTrade(${ticket.id})">Request</button>
        </div>
      </div>
    </div>
  `;
}

function renderRecentTickets() {
  const recentTicketList = document.getElementById("recentTicketList");
  const recentTickets = tickets.slice(0, 3);

  if (recentTickets.length === 0) {
    recentTicketList.innerHTML = `<div class="empty-message">등록된 티켓이 없습니다.</div>`;
    return;
  }

  recentTicketList.innerHTML = recentTickets.map(function(ticket) {
    return createTicketCard(ticket);
  }).join("");
}

function renderTicketList() {
  const container = document.getElementById("ticketListContainer");
  const searchInput = document.getElementById("searchInput");
  const statusFilter = document.getElementById("statusFilter");

  const keyword = searchInput ? searchInput.value.trim().toLowerCase() : "";
  const status = statusFilter ? statusFilter.value : "All";

  const filteredTickets = tickets.filter(function(ticket) {
    const matchKeyword =
      ticket.title.toLowerCase().includes(keyword) ||
      ticket.performanceDate.toLowerCase().includes(keyword) ||
      ticket.performanceTime.toLowerCase().includes(keyword) ||
      ticket.seat.toLowerCase().includes(keyword) ||
      String(ticket.price).includes(keyword);

    const matchStatus = status === "All" || ticket.ticketStatus === status;

    return matchKeyword && matchStatus;
  });

  if (filteredTickets.length === 0) {
    container.innerHTML = `<div class="empty-message">검색 결과가 없습니다.</div>`;
    return;
  }

  container.innerHTML = filteredTickets.map(function(ticket) {
    return createTicketCard(ticket);
  }).join("");
}

function searchFromHome() {
  const mainSearchInput = document.getElementById("mainSearchInput");
  const searchInput = document.getElementById("searchInput");

  showPage("ticketList");

  setTimeout(function() {
    searchInput.value = mainSearchInput.value;
    renderTicketList();
  }, 50);
}

function registerTicket() {
  if (!currentUser) {
    alert("티켓 등록은 로그인 후 이용할 수 있습니다.");
    showPage("login");
    return;
  }

  const title = document.getElementById("ticketTitle").value.trim();
  const performanceDate = document.getElementById("ticketDate").value.trim();
  const performanceTime = document.getElementById("ticketTime").value.trim();
  const seat = document.getElementById("ticketSeat").value.trim();
  const price = document.getElementById("ticketPrice").value.trim();
  const tradeMethod = document.getElementById("tradeMethod").value.trim();
  const description = document.getElementById("ticketDescription").value.trim();

  if (!title || !performanceDate || !performanceTime || !seat || !price || !tradeMethod || !description) {
    alert("모든 티켓 정보를 입력해주세요.");
    return;
  }

  if (Number(price) <= 0 || isNaN(Number(price))) {
    alert("가격은 0보다 큰 숫자여야 합니다.");
    return;
  }

  const newTicket = {
    id: Date.now(),
    title: title,
    performanceDate: performanceDate,
    performanceTime: performanceTime,
    seat: seat,
    price: Number(price),
    tradeMethod: tradeMethod,
    description: description,
    sellerId: currentUser.id,
    sellerName: currentUser.name,
    ticketStatus: "Available"
  };

  tickets.unshift(newTicket);
  saveData();

  document.getElementById("ticketTitle").value = "";
  document.getElementById("ticketDate").value = "";
  document.getElementById("ticketTime").value = "";
  document.getElementById("ticketSeat").value = "";
  document.getElementById("ticketPrice").value = "";
  document.getElementById("tradeMethod").value = "Direct Trade";
  document.getElementById("ticketDescription").value = "";

  alert("티켓이 등록되었습니다.");
  renderRecentTickets();
  renderTicketList();
  renderMyPage();
  showPage("ticketList");
}

function showTicketDetail(ticketId) {
  const ticket = tickets.find(function(item) {
    return item.id === ticketId;
  });

  if (!ticket) {
    alert("티켓 정보를 찾을 수 없습니다.");
    return;
  }

  const container = document.getElementById("ticketDetailContainer");

  container.innerHTML = `
    <div class="detail-wrap">
      <div class="detail-card">
        <div class="detail-visual">
          <span class="status-badge">${ticket.ticketStatus}</span>
          <h2>${ticket.title}</h2>
        </div>

        <div class="detail-body">
          <div class="detail-info-grid">
            <div class="detail-info-item">
              <strong>Performance Date</strong>
              <span>${ticket.performanceDate}</span>
            </div>
            <div class="detail-info-item">
              <strong>Performance Time</strong>
              <span>${ticket.performanceTime}</span>
            </div>
            <div class="detail-info-item">
              <strong>Seat</strong>
              <span>${ticket.seat}</span>
            </div>
            <div class="detail-info-item">
              <strong>Trade Method</strong>
              <span>${ticket.tradeMethod}</span>
            </div>
            <div class="detail-info-item">
              <strong>Seller</strong>
              <span>${ticket.sellerName}</span>
            </div>
            <div class="detail-info-item">
              <strong>Ticket Status</strong>
              <span>${ticket.ticketStatus}</span>
            </div>
          </div>

          <div class="description-box">
            ${ticket.description}
          </div>

          <div class="detail-price">${formatPrice(ticket.price)}</div>

          <div class="detail-buttons">
            <button class="main-btn" onclick="requestTrade(${ticket.id})">Request Trade</button>
            <button class="outline-btn" onclick="openReportModal(${ticket.id})">Report</button>
            <button class="outline-btn" onclick="showPage('ticketList')">Back</button>
          </div>
        </div>
      </div>
    </div>
  `;

  showPage("ticketDetail");
}

function requestTrade(ticketId) {
  if (!currentUser) {
    alert("거래 요청은 로그인 후 이용할 수 있습니다.");
    showPage("login");
    return;
  }

  const ticket = tickets.find(function(item) {
    return item.id === ticketId;
  });

  if (!ticket) {
    alert("티켓 정보를 찾을 수 없습니다.");
    return;
  }

  if (ticket.sellerId === currentUser.id) {
    alert("본인이 등록한 티켓에는 거래 요청을 보낼 수 없습니다.");
    return;
  }

  if (ticket.ticketStatus !== "Available") {
    alert("이미 거래 요청 중이거나 거래가 진행 중인 티켓입니다.");
    return;
  }

  const duplicatedTrade = trades.find(function(trade) {
    return trade.ticketId === ticketId && trade.buyerId === currentUser.id;
  });

  if (duplicatedTrade) {
    alert("이미 거래 요청을 보낸 티켓입니다.");
    return;
  }

  const newTrade = {
    id: Date.now(),
    ticketId: ticket.id,
    ticketTitle: ticket.title,
    buyerId: currentUser.id,
    buyerName: currentUser.name,
    sellerId: ticket.sellerId,
    sellerName: ticket.sellerName,
    tradeStatus: "Requested",
    createdAt: new Date().toLocaleString()
  };

  trades.unshift(newTrade);
  ticket.ticketStatus = "Requested";

  saveData();
  alert("거래 요청이 완료되었습니다.");
  renderTicketList();
  renderRecentTickets();
  showPage("tradeStatus");
}

function acceptTrade(tradeId) {
  if (!currentUser) {
    alert("로그인이 필요합니다.");
    showPage("login");
    return;
  }

  const trade = trades.find(function(item) {
    return item.id === tradeId;
  });

  if (!trade) {
    alert("거래 요청 정보를 찾을 수 없습니다.");
    return;
  }

  if (trade.sellerId !== currentUser.id) {
    alert("해당 거래 요청을 수락할 권한이 없습니다.");
    return;
  }

  if (trade.tradeStatus !== "Requested") {
    alert("이미 처리된 거래 요청입니다.");
    return;
  }

  const ticket = tickets.find(function(item) {
    return item.id === trade.ticketId;
  });

  trade.tradeStatus = "Accepted";

  if (ticket) {
    ticket.ticketStatus = "Trading";
  }

  saveData();
  alert("거래 요청을 수락했습니다.");
  renderTradeStatus();
  renderTicketList();
  renderRecentTickets();
}

function completeTrade(tradeId) {
  if (!currentUser) {
    alert("로그인이 필요합니다.");
    showPage("login");
    return;
  }

  const trade = trades.find(function(item) {
    return item.id === tradeId;
  });

  if (!trade) {
    alert("거래 정보를 찾을 수 없습니다.");
    return;
  }

  if (trade.sellerId !== currentUser.id && trade.buyerId !== currentUser.id) {
    alert("해당 거래를 완료할 권한이 없습니다.");
    return;
  }

  if (trade.tradeStatus !== "Accepted") {
    alert("수락된 거래만 완료할 수 있습니다.");
    return;
  }

  const ticket = tickets.find(function(item) {
    return item.id === trade.ticketId;
  });

  trade.tradeStatus = "Completed";

  if (ticket) {
    ticket.ticketStatus = "Completed";
  }

  saveData();
  alert("거래가 완료되었습니다.");
  renderTradeStatus();
  renderTicketList();
  renderRecentTickets();
}

function renderTradeStatus() {
  const sentTradeList = document.getElementById("sentTradeList");
  const receivedTradeList = document.getElementById("receivedTradeList");

  if (!currentUser) {
    sentTradeList.innerHTML = `<div class="empty-message">로그인 후 거래 상태를 확인할 수 있습니다.</div>`;
    receivedTradeList.innerHTML = `<div class="empty-message">로그인 후 거래 상태를 확인할 수 있습니다.</div>`;
    return;
  }

  const sentTrades = trades.filter(function(trade) {
    return trade.buyerId === currentUser.id;
  });

  const receivedTrades = trades.filter(function(trade) {
    return trade.sellerId === currentUser.id;
  });

  if (sentTrades.length === 0) {
    sentTradeList.innerHTML = `<div class="empty-message">보낸 거래 요청이 없습니다.</div>`;
  } else {
    sentTradeList.innerHTML = sentTrades.map(function(trade) {
      const ticket = tickets.find(function(item) {
        return item.id === trade.ticketId;
      });

      if (!ticket) {
        return `
          <div class="trade-item">
            <strong>${trade.ticketTitle}</strong>
            <span>티켓 정보를 찾을 수 없습니다.</span>
          </div>
        `;
      }

      return `
        <div class="trade-item">
          <strong>${trade.ticketTitle}</strong>
          <span>Seller: ${trade.sellerName}</span>
          <span>Status: ${trade.tradeStatus}</span>
          <span>Requested At: ${trade.createdAt}</span>
          <span>Date: ${ticket.performanceDate} · ${ticket.performanceTime}</span>
          <span>Seat: ${ticket.seat}</span>
          <span>Price: ${formatPrice(ticket.price)}</span>
          <span>Trade Method: ${ticket.tradeMethod}</span>

          <button class="outline-btn" onclick="showTicketDetail(${ticket.id})">View Ticket Detail</button>
          ${trade.tradeStatus === "Accepted" ? `<button class="main-btn small" onclick="completeTrade(${trade.id})">Complete</button>` : ""}
        </div>
      `;
    }).join("");
  }

  if (receivedTrades.length === 0) {
    receivedTradeList.innerHTML = `<div class="empty-message">받은 거래 요청이 없습니다.</div>`;
  } else {
    receivedTradeList.innerHTML = receivedTrades.map(function(trade) {
      const ticket = tickets.find(function(item) {
        return item.id === trade.ticketId;
      });

      if (!ticket) {
        return `
          <div class="trade-item">
            <strong>${trade.ticketTitle}</strong>
            <span>티켓 정보를 찾을 수 없습니다.</span>
          </div>
        `;
      }

      return `
        <div class="trade-item">
          <strong>${trade.ticketTitle}</strong>
          <span>Buyer: ${trade.buyerName}</span>
          <span>Status: ${trade.tradeStatus}</span>
          <span>Requested At: ${trade.createdAt}</span>
          <span>Date: ${ticket.performanceDate} · ${ticket.performanceTime}</span>
          <span>Seat: ${ticket.seat}</span>
          <span>Price: ${formatPrice(ticket.price)}</span>
          <span>Trade Method: ${ticket.tradeMethod}</span>

          <button class="outline-btn" onclick="showTicketDetail(${ticket.id})">View Ticket Detail</button>
          ${trade.tradeStatus === "Requested" ? `<button class="main-btn small" onclick="acceptTrade(${trade.id})">Accept</button>` : ""}
          ${trade.tradeStatus === "Accepted" ? `<button class="main-btn small" onclick="completeTrade(${trade.id})">Complete</button>` : ""}
        </div>
      `;
    }).join("");
  }
}

function renderMyPage() {
  const profileName = document.getElementById("profileName");
  const profileEmail = document.getElementById("profileEmail");
  const myTicketList = document.getElementById("myTicketList");

  if (!currentUser) {
    profileName.textContent = "Guest";
    profileEmail.textContent = "로그인이 필요합니다.";
    myTicketList.innerHTML = `<div class="empty-message">로그인 후 내가 등록한 티켓을 확인할 수 있습니다.</div>`;
    return;
  }

  profileName.textContent = currentUser.name;
  profileEmail.textContent = currentUser.email;

  const myTickets = tickets.filter(function(ticket) {
    return ticket.sellerId === currentUser.id;
  });

  if (myTickets.length === 0) {
    myTicketList.innerHTML = `<div class="empty-message">등록한 티켓이 없습니다.</div>`;
    return;
  }

  myTicketList.innerHTML = myTickets.map(function(ticket) {
    return `
      <div class="my-ticket-item">
        <strong>${ticket.title}</strong>
        <span>${ticket.performanceDate} · ${ticket.performanceTime}</span>
        <span>${ticket.seat}</span>
        <span>${formatPrice(ticket.price)}</span>
        <span>Status: ${ticket.ticketStatus}</span>
        <button class="outline-btn" onclick="showTicketDetail(${ticket.id})">Detail</button>
      </div>
    `;
  }).join("");
}

function openReportModal(ticketId) {
  if (!currentUser) {
    alert("신고 기능은 로그인 후 이용할 수 있습니다.");
    showPage("login");
    return;
  }

  const ticket = tickets.find(function(item) {
    return item.id === ticketId;
  });

  if (!ticket) {
    alert("신고할 티켓 정보를 찾을 수 없습니다.");
    return;
  }

  if (ticket.sellerId === currentUser.id) {
    alert("자신이 등록한 티켓은 신고할 수 없습니다.");
    return;
  }

  selectedReportTicketId = ticketId;
  document.getElementById("reportReason").value = "Incorrect ticket information";
  document.getElementById("reportDetail").value = "";
  document.getElementById("reportModal").classList.add("show");
}

function closeReportModal() {
  selectedReportTicketId = null;
  document.getElementById("reportModal").classList.remove("show");
}

function submitReport() {
  if (!currentUser) {
    alert("로그인이 필요합니다.");
    closeReportModal();
    showPage("login");
    return;
  }

  const reason = document.getElementById("reportReason").value;
  const detail = document.getElementById("reportDetail").value.trim();

  if (!reason || !detail) {
    alert("신고 사유와 상세 내용을 입력해주세요.");
    return;
  }

  const ticket = tickets.find(function(item) {
    return item.id === selectedReportTicketId;
  });

  if (!ticket) {
    alert("신고 대상을 찾을 수 없습니다.");
    closeReportModal();
    return;
  }

  const newReport = {
    id: Date.now(),
    ticketId: ticket.id,
    ticketTitle: ticket.title,
    reporterId: currentUser.id,
    reporterName: currentUser.name,
    targetSellerId: ticket.sellerId,
    targetSellerName: ticket.sellerName,
    reason: reason,
    detail: detail,
    reportDate: new Date().toLocaleString()
  };

  reports.unshift(newReport);
  saveData();

  alert("신고가 접수되었습니다.");
  closeReportModal();
}

updateAuthArea();
renderRecentTickets();
renderTicketList();
renderTradeStatus();
renderMyPage();