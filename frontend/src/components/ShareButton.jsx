import { useState } from 'react';

function ShareButton({ url, label }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (event) => {
    event.preventDefault();
    const shareUrl = `${window.location.origin}${url}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: document.title, url: shareUrl });
      } catch {
        // ignore
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('Não foi possível copiar o link.');
    }
  };

  return (
    <button type="button" className="btn-compartilhar" onClick={handleShare}>
      {copied ? 'Link copiado!' : label}
    </button>
  );
}

export default ShareButton;
