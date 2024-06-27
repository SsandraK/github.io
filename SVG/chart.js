export function createLineChart(elementId, data, title) {
    const svgNS = "http://www.w3.org/2000/svg";
    const chartWidth = 1500;
    const chartHeight = 600;
    const padding = 50;
    const width = chartWidth - 2 * padding;
    const height = chartHeight - 2 * padding;

    const maxXP = Math.max(...data.map(d => d.amount));
    const xScale = width / (data.length - 1);
    const yScale = height / maxXP;

    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", chartWidth);
    svg.setAttribute("height", chartHeight);

    // Y-axis (XP amounts)
    const yAxis = document.createElementNS(svgNS, "line");
    yAxis.setAttribute("x1", padding);
    yAxis.setAttribute("y1", padding);
    yAxis.setAttribute("x2", padding);
    yAxis.setAttribute("y2", chartHeight - padding);
    yAxis.setAttribute("stroke", "black");
    svg.appendChild(yAxis);

    // X-axis (Path names)
    const xAxis = document.createElementNS(svgNS, "line");
    svg.appendChild(xAxis);

    // Add labels for Y axis (XP amounts)
    const yAxisLabelCount = 10; // Adjust the number of labels as needed
    for (let i = 0; i <= yAxisLabelCount; i++) {
        const y = chartHeight - padding - i * (height / yAxisLabelCount);
        const label = document.createElementNS(svgNS, "text");
        label.setAttribute("x", padding - 10); // Adjust as needed
        label.setAttribute("y", y);
        label.setAttribute("text-anchor", "end");
        label.setAttribute("dominant-baseline", "middle");
        label.textContent = Math.round((i * maxXP) / yAxisLabelCount);
        svg.appendChild(label);
    }

    // Add label for Y axis at the end
    const yLabel = document.createElementNS(svgNS, "text");
    yLabel.setAttribute("x", padding - 20);
    yLabel.setAttribute("y", padding - 10);
    yLabel.setAttribute("text-anchor", "end");
    yLabel.setAttribute("dominant-baseline", "middle");
    yLabel.textContent = "XP Amounts";
    svg.appendChild(yLabel);

    // Add label for X axis at the end
    const xLabel = document.createElementNS(svgNS, "text");
    xLabel.setAttribute("x", chartWidth / 2); // Centered horizontally
    xLabel.setAttribute("y", chartHeight); // At the bottom
    xLabel.setAttribute("text-anchor", "middle");
    xLabel.setAttribute("stroke", "white");
    xLabel.textContent = "Path Names"; // Label for X axis
    svg.appendChild(xLabel);


    // LINE
    const linePath = document.createElementNS(svgNS, "path");
    let d = `M ${padding},${chartHeight - padding - data[0].amount * yScale}`;
    data.forEach((item, index) => {
        d += ` L ${padding + index * xScale},${chartHeight - padding - item.amount * yScale}`;
    });
    linePath.setAttribute("d", d);
    linePath.setAttribute("fill", "none");
    linePath.setAttribute("stroke", "yellow");
    linePath.setAttribute("stroke-width", 2);
    svg.appendChild(linePath);

    const tooltip = document.getElementById('tooltip');

    data.forEach((item, index) => {
        const cx = padding + index * xScale;
        const cy = chartHeight - padding - item.amount * yScale;

        const circle = document.createElementNS(svgNS, "circle");
        circle.setAttribute("cx", cx);
        circle.setAttribute("cy", cy);
        circle.setAttribute("r", 5);
        circle.setAttribute("fill", "steelblue");

        circle.addEventListener('mouseover', (event) => {
            tooltip.textContent = item.path; // Set full path content
            tooltip.classList.add('visible');

            // Position the tooltip dynamically
            const tooltipX = event.clientX + 5; // Adjust offset as needed
            const tooltipY = event.clientY + 5; // Adjust offset as needed
            tooltip.style.left = `${tooltipX}px`;
            tooltip.style.top = `${tooltipY}px`;
        });

        circle.addEventListener('mouseout', () => {
            tooltip.classList.remove('visible');
        });

        svg.appendChild(circle);
    });

    const chartContainer = document.getElementById(elementId);
    if (chartContainer) {
        chartContainer.innerHTML = ''; // Clear previous chart if any
        chartContainer.appendChild(svg);
    } else {
        console.error(`Element with ID ${elementId} not found`);
    }
}
