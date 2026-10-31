// apiClient.mjs
// BIXTONE ULTIMATE PRO - Client untuk YouWare API
// Sesuai openapi.yaml final jenengan

const API_URL = 'https://api.bixtone.bixlabs.id'; // Ganti dengan URL YouWare jenengan

export async function createProject(prompt3Layer) {
  const res = await fetch(`${API_URL}/v1/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: prompt3Layer })
  });
  return res.json();
}

export async function generateMusic(projectId, prompt3Layer, seed = 0) {
  const payload = {
    prompt: prompt3Layer,
    seed: seed,
    modelId: 'bixtone-v1',
    outputProfile: 'standard',
    durationSeconds: prompt3Layer.layer1_voice.durationSeconds,
    referencePolicyAccepted: true
  };

  const res = await fetch(`${API_URL}/v1/projects/${projectId}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Idempotency-Key': Date.now().toString() },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function searchCatalog(category, q = '', page = 1) {
  const res = await fetch(`${API_URL}/v1/catalog?category=${category}&q=${q}&page=${page}&pageSize=30`);
  return res.json();
}

export async function queueCorrection(projectId, targets, instruction) {
  const res = await fetch(`${API_URL}/v1/projects/${projectId}/corrections`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targets: targets, instruction: instruction, intensity: 0.5 })
  });
  return res.json();
}

export async function queueExport(versionId, formats) {
  const res = await fetch(`${API_URL}/v1/exports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ versionId: versionId, formats: formats })
  });
  return res.json();
}
