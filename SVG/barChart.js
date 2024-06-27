export function createBarChart(elementId, data) {
    const svgNS = "http://www.w3.org/2000/svg";
    const chartWidth = 1200;
    const chartHeight = 600;
    const padding = 150;
    const barWidth = 40;
    const barSpacing = 17;
    const width = chartWidth - 2 * padding;

    const maxXP = Math.max(...data.map(d => d.amount));
    const yScale = (chartHeight - 2 * padding) / maxXP;

    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", chartWidth);
    svg.setAttribute("height", chartHeight);

    // Y-axis (XP amounts)
    const yAxis = document.createElementNS(svgNS, "line");
    yAxis.setAttribute("x1", padding);
    yAxis.setAttribute("y1", padding);
    yAxis.setAttribute("x2", padding);
    yAxis.setAttribute("y2", chartHeight - padding);
    yAxis.setAttribute("stroke", "white");
    svg.appendChild(yAxis);

    // X-axis (Path names)
    const xAxis = document.createElementNS(svgNS, "line");
    xAxis.setAttribute("x1", padding);
    xAxis.setAttribute("y1", chartHeight - padding);
    xAxis.setAttribute("x2", chartWidth - padding);
    xAxis.setAttribute("y2", chartHeight - padding);
    xAxis.setAttribute("stroke", "white");
    svg.appendChild(xAxis);

    // labels for Y axis (XP amounts)
    const yAxisLabelCount = 10;
    for (let i = 0; i <= yAxisLabelCount; i++) {
        const y = chartHeight - padding - i * (chartHeight - 2 * padding) / yAxisLabelCount;
        const label = document.createElementNS(svgNS, "text");
        label.setAttribute("x", padding - 10);
        label.setAttribute("y", y);
        label.setAttribute("text-anchor", "end");
        label.setAttribute("dominant-baseline", "middle");
        label.setAttribute("fill", "white");
        label.textContent = Math.round((i * maxXP) / yAxisLabelCount);
        svg.appendChild(label);
    }

    // label for Y axis at the top (XP Amount)
    const yLabel = document.createElementNS(svgNS, "text");
    yLabel.setAttribute("x", padding - 15);
    yLabel.setAttribute("y", padding - 30);
    yLabel.setAttribute("text-anchor", "end");
    yLabel.setAttribute("dominant-baseline", "middle");
    yLabel.setAttribute("fill", "white");
    yLabel.textContent = "XP Amount";
    svg.appendChild(yLabel);

    // Create bars, tooltips, and XP line path data
    let linePathData = `M ${padding},${chartHeight - padding}`;
    data.forEach((item, index) => {
        const x = padding + index * (barWidth + barSpacing);
        const barHeight = item.amount * yScale;

        // Create bar
        const bar = document.createElementNS(svgNS, "rect");
        bar.setAttribute("x", x);
        bar.setAttribute("y", chartHeight - padding - barHeight);
        bar.setAttribute("width", barWidth);
        bar.setAttribute("height", barHeight);
        bar.setAttribute("fill", "steelblue");
        bar.setAttribute("stroke", "white");
        bar.setAttribute("stroke-width", "2");
        svg.appendChild(bar);

        // Update line path data
        linePathData += ` L ${x + barWidth / 2},${chartHeight - padding - barHeight}`;

        // Add path name labels below the bars
        const label = document.createElementNS(svgNS, "text");
        label.setAttribute("x", x + barWidth / 2);
        label.setAttribute("y", chartHeight - padding + 70); // Adjusted y position to move the labels further down
        label.setAttribute("text-anchor", "middle");
        label.setAttribute("dominant-baseline", "middle");
        label.setAttribute("fill", "white");
        label.setAttribute("transform", `rotate(-45, ${x + barWidth / 2}, ${chartHeight - padding + 70})`); // Adjusted transform origin
        label.textContent = item.path;
        svg.appendChild(label);
    });

    // Create the XP line path
    const linePath = document.createElementNS(svgNS, "path");
    linePath.setAttribute("d", linePathData);
    linePath.setAttribute("fill", "none");
    linePath.setAttribute("stroke", "yellow");
    linePath.setAttribute("stroke-width", "2");
    svg.appendChild(linePath);

    // Create circles and tooltips for XP amounts
    data.forEach((item, index) => {
        const x = padding + index * (barWidth + barSpacing) + barWidth / 2;
        const y = chartHeight - padding - item.amount * yScale;

        // Create circle
        const circle = document.createElementNS(svgNS, "circle");
        circle.setAttribute("cx", x);
        circle.setAttribute("cy", y);
        circle.setAttribute("r", 5);
        circle.setAttribute("fill", "red");
        svg.appendChild(circle);

        // Create tooltip for circles
        const circleTooltip = document.createElementNS(svgNS, "text");
        circleTooltip.setAttribute("x", x);
        circleTooltip.setAttribute("y", y - 10);
        circleTooltip.setAttribute("text-anchor", "middle");
        circleTooltip.setAttribute("fill", "white");
        circleTooltip.textContent = item.amount;
        circleTooltip.style.visibility = "hidden";
        svg.appendChild(circleTooltip);

        // Show tooltip on hover
        circle.addEventListener("mouseover", () => {
            circleTooltip.style.visibility = "visible";
        });

        // Hide tooltip on mouseout
        circle.addEventListener("mouseout", () => {
            circleTooltip.style.visibility = "hidden";
        });
    });

    const chartContainer = document.getElementById(elementId);
    if (chartContainer) {
        chartContainer.innerHTML = '';
        chartContainer.appendChild(svg);
    } else {
        console.error(`Element with ID ${elementId} not found`);
    }
}
