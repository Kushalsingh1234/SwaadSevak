import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { AnalyticsData, Restaurant } from '../types';

export async function downloadAnalyticsPdf(
  data: AnalyticsData,
  restaurant: Restaurant | null
): Promise<void> {
  const container = document.createElement('div');
  container.id = 'swaad-analytics-pdf-container';
  container.style.position = 'fixed';
  container.style.left = '0';
  container.style.top = '0';
  container.style.zIndex = '-9999';
  container.style.pointerEvents = 'none';
  container.style.width = '800px';
  container.style.backgroundColor = '#ffffff';
  container.style.padding = '36px 40px';
  container.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
  container.style.color = '#0f172a';
  container.style.boxSizing = 'border-box';
  container.style.lineHeight = '1.45';

  const formatCurrency = (val: number) => '₹' + Math.round(val).toLocaleString('en-IN');

  const topItemsHtml = data.itemPerformance.items.slice(0, 5).map((it, idx) => `
    <tr style="border-bottom: 1px solid #f1f5f9;">
      <td style="padding: 7px 6px; font-weight: 600; color: #475569;">#${idx + 1}</td>
      <td style="padding: 7px 6px; font-weight: 600; color: #0f172a;">${it.name}</td>
      <td style="padding: 7px 6px; color: #64748b;">${it.category}</td>
      <td style="padding: 7px 6px; text-align: center; font-weight: 600; color: #0f172a;">${it.quantitySold}</td>
      <td style="padding: 7px 6px; text-align: right; font-weight: 700; color: #ea580c;">${formatCurrency(it.revenue)}</td>
      <td style="padding: 7px 6px; text-align: right; color: #64748b;">${it.shareOfSales}%</td>
    </tr>
  `).join('');

  const channelRowsHtml = data.channelBreakdown.channels.map(ch => `
    <tr style="border-bottom: 1px solid #f1f5f9;">
      <td style="padding: 7px 6px; font-weight: 600; color: #0f172a;">${ch.displayName}</td>
      <td style="padding: 7px 6px; text-align: center; color: #334155;">${ch.orders}</td>
      <td style="padding: 7px 6px; text-align: right; font-weight: 700; color: #0f172a;">${formatCurrency(ch.sales)}</td>
      <td style="padding: 7px 6px; text-align: right; color: #475569;">${formatCurrency(ch.aov)}</td>
      <td style="padding: 7px 6px; text-align: right; font-weight: 600; color: #ea580c;">${ch.shareOfSales}%</td>
    </tr>
  `).join('');

  const insightsBulletsHtml = data.insights.slice(0, 4).map(ins => `
    <li style="margin-bottom: 6px; color: #334155;">
      <strong style="color: #0f172a;">${ins.title}:</strong> ${ins.description}
    </li>
  `).join('');

  container.innerHTML = `
    <!-- Top Brand Header -->
    <div style="display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 18px; border-bottom: 2px solid #ea580c;">
      <div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 28px; height: 28px; background-color: #ea580c; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #ffffff; font-weight: 900; font-size: 16px;">
            S
          </div>
          <span style="font-size: 18px; font-weight: 800; color: #1e112a; letter-spacing: -0.02em;">SWAAD SEVAK</span>
          <span style="font-size: 11px; font-weight: 700; background-color: #ffedd5; color: #c2410c; padding: 2px 7px; border-radius: 999px;">BUSINESS INTELLIGENCE</span>
        </div>
        <h1 style="margin: 8px 0 2px 0; font-size: 20px; font-weight: 800; color: #0f172a;">
          ${restaurant?.name || 'Restaurant Performance Report'}
        </h1>
        <p style="margin: 0; font-size: 11px; color: #64748b;">
          ${restaurant?.address ? `${restaurant.address}, ` : ''}${restaurant?.city || ''}
        </p>
      </div>

      <div style="text-align: right;">
        <span style="display: inline-block; font-size: 12px; font-weight: 700; color: #ea580c; background-color: #fff7ed; border: 1px solid #fdba74; padding: 4px 10px; border-radius: 6px;">
          ${data.period.label}
        </span>
        <p style="margin: 4px 0 0 0; font-size: 10px; color: #94a3b8;">
          Generated: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
        </p>
        <p style="margin: 2px 0 0 0; font-size: 10px; color: #64748b;">
          Comparison: ${data.period.comparisonLabel}
        </p>
      </div>
    </div>

    <!-- Morning Brief / Executive Summary Box -->
    <div style="margin-top: 18px; padding: 14px 18px; background-color: #faf5ff; border: 1px solid #f3e8ff; border-left: 4px solid #9333ea; border-radius: 8px;">
      <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 800; color: #581c87;">
        ${data.executiveReport.headline}
      </h3>
      <ul style="margin: 6px 0 0 0; padding-left: 18px; font-size: 11.5px; line-height: 18px;">
        ${data.executiveReport.bullets.map(b => `<li style="color: #3b0764;">${b}</li>`).join('')}
      </ul>
    </div>

    <!-- 6 KPI Grid -->
    <div style="margin-top: 18px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 14px;">
        <p style="margin: 0; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Total Sales</p>
        <h2 style="margin: 4px 0 0 0; font-size: 20px; font-weight: 900; color: #0f172a;">${formatCurrency(data.summary.totalSales)}</h2>
        <span style="font-size: 10px; font-weight: 700; color: ${data.summary.salesChangePercent >= 0 ? '#16a34a' : '#dc2626'};">
          ${data.summary.salesChangePercent >= 0 ? '↑' : '↓'} ${Math.abs(data.summary.salesChangePercent)}% ${data.period.comparisonLabel}
        </span>
      </div>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 14px;">
        <p style="margin: 0; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Total Orders</p>
        <h2 style="margin: 4px 0 0 0; font-size: 20px; font-weight: 900; color: #0f172a;">${data.summary.totalOrders}</h2>
        <span style="font-size: 10px; font-weight: 700; color: ${data.summary.ordersChangePercent >= 0 ? '#16a34a' : '#dc2626'};">
          ${data.summary.ordersChangePercent >= 0 ? '↑' : '↓'} ${Math.abs(data.summary.ordersChangePercent)}%
        </span>
      </div>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 14px;">
        <p style="margin: 0; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Avg Order Value</p>
        <h2 style="margin: 4px 0 0 0; font-size: 20px; font-weight: 900; color: #0f172a;">${formatCurrency(data.summary.averageOrderValue)}</h2>
        <span style="font-size: 10px; font-weight: 700; color: ${data.summary.aovChangePercent >= 0 ? '#16a34a' : '#dc2626'};">
          ${data.summary.aovChangePercent >= 0 ? '↑' : '↓'} ${Math.abs(data.summary.aovChangePercent)}%
        </span>
      </div>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 14px;">
        <p style="margin: 0; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Dine-In Sales</p>
        <h2 style="margin: 4px 0 0 0; font-size: 18px; font-weight: 800; color: #ea580c;">${formatCurrency(data.summary.dineInSales)}</h2>
        <span style="font-size: 10px; color: #64748b;">${data.summary.totalSales > 0 ? Math.round((data.summary.dineInSales / data.summary.totalSales) * 100) : 0}% of revenue</span>
      </div>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 14px;">
        <p style="margin: 0; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Online Sales</p>
        <h2 style="margin: 4px 0 0 0; font-size: 18px; font-weight: 800; color: #0284c7;">${formatCurrency(data.summary.onlineSales)}</h2>
        <span style="font-size: 10px; color: #64748b;">Swiggy & Zomato</span>
      </div>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 14px;">
        <p style="margin: 0; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Rejection Rate</p>
        <h2 style="margin: 4px 0 0 0; font-size: 18px; font-weight: 800; color: ${data.summary.rejectionRate > 5 ? '#e11d48' : '#334155'};">
          ${data.summary.rejectionRate}%
        </h2>
        <span style="font-size: 10px; color: ${data.summary.rejectionRateChangeDiff > 0 ? '#e11d48' : '#16a34a'};">
          ${data.summary.rejectionRateChangeDiff > 0 ? `+${data.summary.rejectionRateChangeDiff}% spike` : 'Optimal stability'}
        </span>
      </div>
    </div>

    <!-- Channel Breakdown Section -->
    <div style="margin-top: 22px;">
      <h3 style="margin: 0 0 8px 0; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #1e293b;">
        Sales by Channel
      </h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 11.5px; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden;">
        <thead>
          <tr style="background-color: #f1f5f9; text-align: left; color: #475569; font-weight: 700;">
            <th style="padding: 8px 6px;">Channel</th>
            <th style="padding: 8px 6px; text-align: center;">Orders</th>
            <th style="padding: 8px 6px; text-align: right;">Sales</th>
            <th style="padding: 8px 6px; text-align: right;">Avg Order</th>
            <th style="padding: 8px 6px; text-align: right;">Share</th>
          </tr>
        </thead>
        <tbody>
          ${channelRowsHtml}
        </tbody>
      </table>
      <p style="margin: 6px 0 0 0; font-size: 11px; color: #64748b; font-style: italic;">
        ${data.channelBreakdown.plainEnglishInsight}
      </p>
    </div>

    <!-- Top Dishes Section -->
    <div style="margin-top: 22px;">
      <h3 style="margin: 0 0 8px 0; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #1e293b;">
        Top Performing Menu Items
      </h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 11.5px; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden;">
        <thead>
          <tr style="background-color: #f1f5f9; text-align: left; color: #475569; font-weight: 700;">
            <th style="padding: 8px 6px; width: 35px;">#</th>
            <th style="padding: 8px 6px;">Dish Name</th>
            <th style="padding: 8px 6px;">Category</th>
            <th style="padding: 8px 6px; text-align: center;">Quantity</th>
            <th style="padding: 8px 6px; text-align: right;">Revenue</th>
            <th style="padding: 8px 6px; text-align: right;">Share</th>
          </tr>
        </thead>
        <tbody>
          ${topItemsHtml}
        </tbody>
      </table>
    </div>

    <!-- Operational Highlights & Insights -->
    <div style="margin-top: 22px; display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 14px;">
        <h4 style="margin: 0 0 6px 0; font-size: 12px; font-weight: 800; color: #0f172a; text-transform: uppercase;">
          Operational Highlights
        </h4>
        <p style="margin: 0 0 4px 0; font-size: 11.5px; color: #334155;">
          <strong>Busiest Hours:</strong> ${data.peakHours.busiestPeriodLabel} (${data.peakHours.busiestPeriodShare}% of volume)
        </p>
        <p style="margin: 0 0 4px 0; font-size: 11.5px; color: #334155;">
          <strong>Strongest Day:</strong> ${data.peakDays.bestDayName}
        </p>
        <p style="margin: 0; font-size: 11.5px; color: #334155;">
          <strong>Most Active Table:</strong> ${data.tablePerformance.mostActiveTable || 'Table 01'}
        </p>
      </div>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 14px;">
        <h4 style="margin: 0 0 6px 0; font-size: 12px; font-weight: 800; color: #0f172a; text-transform: uppercase;">
          Business Insights
        </h4>
        <ul style="margin: 0; padding-left: 16px; font-size: 11px; line-height: 16px;">
          ${insightsBulletsHtml}
        </ul>
      </div>
    </div>

    <!-- Footer Watermark -->
    <div style="margin-top: 24px; padding-top: 12px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #94a3b8;">
      <span>Powered by Swaad Sevak — Modern Restaurant Operating System</span>
      <span>Confidential Business Report</span>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`SwaadSevak_Analytics_${data.period.key}_${Date.now()}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
}
