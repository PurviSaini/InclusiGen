var ans = document.getElementsByClassName("drop-down");
console.log(ans);
var i;
for (i = 0; i < ans.length; i++) {
  ans[i].addEventListener("click", function (e) {
    e.preventDefault();
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  });
}
