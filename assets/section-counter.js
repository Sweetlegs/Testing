document.addEventListener("DOMContentLoaded", () => {
  console.log("Creating Section Counters...")

  // Loads Counter Blocks

  const main_sections = [...document.querySelectorAll("main div.count-section")];
  var globalCounter = main_sections.length
  main_sections.reverse().forEach((section, index) => {
    globalCounter--;
    const counter = globalCounter + 1;
    const counterText = counter < 10 ? "0" + counter : String(counter);
    if (counter > 99) {
      return;
    }
    const section_counter = section.querySelector("div.section-counter")
    if (section_counter) {
      section_counter.innerHTML = `<span>${counterText[0]}</span><span>${counterText[1]}</span>`;
    }
  })
  /*const visible_sections = []
  all_DOM_sections.forEach(section => {
    if (section.offsetHeight > 0 && section.querySelector("header, footer") === null) {
      visible_sections.push(section)
    }
  })
  visible_sections.forEach((section) => {
    const list = section.querySelectorAll("div.section-counter")
    if (list.length == 0) return
    list.forEach(el => {
      const n = Number(globalCounter + 1);
      const counter = n < 10 ? "0" + n : String(n);
      if (counter > 99) {
        return;
      }
      const minWidth = parseInt(el.getAttribute("data-skip-if-max-width")) || null;
      if (minWidth && screen.width > minWidth) return
      el.innerHTML = `<span>${counter[0]}</span><span>${counter[1]}</span>`;
      globalCounter++;
    });
  })

  /* Add Counter from Default Sections
  const all_DOM_sections = document.querySelectorAll(".shopify-section");
  const visible_sections = []
  all_DOM_sections.forEach(section => {
    if(section.offsetHeight > 0 && section.querySelector("header, footer") === null){
      visible_sections.push(section)
    }
  })*/
})