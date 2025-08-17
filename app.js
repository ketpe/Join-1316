async function includeHtml(targetId, file) {

  try {
    const element = document.getElementById(targetId);
    if (!element) throw new Error(`Target #${targetId} not found`);

    const res = await fetch(file, { cache: "no-cache" });
    if (!res.ok) throw new Error(`Error loading: ${file} (${res.status})`);

    const html = await res.text();
    element.innerHTML = html;

    return element;
  } catch (error) {
    return error.message;
  }


}

window.includeHtml = includeHtml;