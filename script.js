async function generatePDF() {
    const { jsPDF } = window.jspdf; // ✅ إصلاح هنا

    const items = document.querySelectorAll("li");
    const tempList = [];

    items.forEach(item => {
        const input = item.querySelector("input.counter");
        if (input && parseInt(input.value) > 0) {
            const label = item.textContent.replace(input.value, "").trim();
            tempList.push(`${label} - الكمية: ${input.value}`);
        }
    });

    if (tempList.length === 0) {
        alert("الرجاء تحديد كمية واحدة على الأقل قبل تحميل القائمة.");
        return;
    }

    const tempDiv = document.createElement("div");
    tempDiv.style.padding = "20px";
    tempDiv.style.fontFamily = "Arial, sans-serif";
    tempDiv.style.direction = "rtl";
    tempDiv.innerHTML = `
    <h2 style="text-align: center; color: #0078d7;">🛒 قائمة التسوق الأسبوعية</h2>
    <ul style="font-size: 16px;">
      ${tempList.map(item => `<li style="margin-bottom: 10px;">${item}</li>`).join("")}
    </ul>
  `;

    document.body.appendChild(tempDiv);

    await html2canvas(tempDiv, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4"); // ✅ إصلاح هنا
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("weekly-shopping.pdf");
    });

    document.body.removeChild(tempDiv);
}