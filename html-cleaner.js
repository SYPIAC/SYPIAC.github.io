function cleanHTML(html) {
  // First, remove all img tags
  html = html.replace(/<img[^>]*>/g, '');
  
  // Remove height attributes
  html = html.replace(/\sheight="[^"]*"/g, '');
  
  // Remove data-hover attributes
  html = html.replace(/\sdata-hover="[^"]*"/g, '');
  
  // Remove class="KeywordPopups"
  html = html.replace(/\sclass="KeywordPopups"/g, '');
  
  // Remove loading="lazy"
  html = html.replace(/\sloading="lazy"/g, '');
  
  // Remove class="item_currency"
  html = html.replace(/\sclass="item_currency"/g, '');
  
  // Remove class="implicitMod"
  html = html.replace(/\sclass="implicitMod"/g, '');
  
  // Remove class="mod-value"
  html = html.replace(/\sclass="mod-value"/g, '');
  
  // Clean up any extra whitespace
  html = html.replace(/\s+/g, ' ').trim();
  
  // Remove any empty tags
  html = html.replace(/<[^>]*>\s*<\/[^>]*>/g, '');
  
  return html;
}

// Test the function with a sample from your data
const sampleInput = `<td><a class="item_currency" data-hover="?t=BaseItemTypes&amp;c=Metadata%2FItems%2FCurrency%2FDistilledEmotion8" href="https://poe2db.tw/us/Distilled_Fear"><img loading="lazy" src="Distilled%20Emotions%20-%20Distilled%20Emotions%20-%20PoE2DB,%20Path%20of%20Exile%20Wiki_files/distilledfear.webp" height="16">Distilled Fear</a></td>`;

console.log("Original:", sampleInput);
console.log("Cleaned:", cleanHTML(sampleInput));

// Process the full content
const contentElement = document.querySelector('document_content');
if (contentElement) {
    const cleanedContent = cleanHTML(contentElement.innerHTML);
    console.log("Cleaned full content:", cleanedContent);
}
