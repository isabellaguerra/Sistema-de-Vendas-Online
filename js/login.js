const form = document.getElementById("formLogin");
const alertaErro = document.getElementById("loginErro");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();

  alertaErro.textContent = "";

  const resultado = Auth.login(email, senha);

  if (resultado.success) {
    if (resultado.usuario.tipo === "admin") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "pedido.html";
    }
  } else {
    alertaErro.textContent = `❌ ${resultado.erro}`;
  }
});
