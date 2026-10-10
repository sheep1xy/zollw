// Answer checker. Only hashes live here, so the answer never appears in the page source.
(function (root) {
  const WORDS_HASH = "83d71662705af53b89b781b3c55cd520ce244feb83264034ca792d39f874a5b9"; // SHA-256 of the spelled-out letters
  const NUM_HASH = "6a244b453cb5128c5cafa747b983e7559033ab2c6e96c8f9abfc359974b6a466";   // SHA-256 of "x,y,z"

  async function sha256(s) {
    const subtle = (root.crypto || require("crypto").webcrypto).subtle;
    const buf = await subtle.digest("SHA-256", new TextEncoder().encode(s));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  // spelled-out form: letters only, uppercase, trailing Q padding ignored
  function normWords(s) { return s.toUpperCase().replace(/[^A-Z]/g, "").replace(/Q+$/, ""); }
  // numeric form: exactly three integers (unicode minus signs accepted)
  function normNums(s) {
    const m = s.replace(/[−–—]/g, "-").match(/-?\d+/g);
    return m && m.length === 3 ? m.map(Number).join(",") : null;
  }
  async function check(s) {
    if ((await sha256(normWords(s))) === WORDS_HASH) return true;
    const n = normNums(s);
    return !!n && (await sha256(n)) === NUM_HASH;
  }
  root.KeeperCheck = { check, normWords, normNums };
  if (typeof module !== "undefined") module.exports = root.KeeperCheck;
})(typeof window !== "undefined" ? window : globalThis);
