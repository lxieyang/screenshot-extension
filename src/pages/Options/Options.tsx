import React, { useState, useEffect } from 'react';
import './Options.css';

const Options: React.FC = () => {
  const [openInTab, setOpenInTab] = useState(true);
  const [download, setDownload] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get(['openInTab'], (result) => {
      if (result.openInTab === undefined) {
        chrome.storage.sync.set({ openInTab });
      } else {
        setOpenInTab(result.openInTab);
      }
    });

    chrome.storage.sync.get(['download'], (result) => {
      if (result.download === undefined) {
        chrome.storage.sync.set({ download });
      } else {
        setDownload(result.download);
      }
    });
  }, []);

  const openInNewTabClickedHandler = (to: boolean) => {
    setOpenInTab(to);
    chrome.storage.sync.set({ openInTab: to });
  };

  const downloadClickedHandler = (to: boolean) => {
    setDownload(to);
    chrome.storage.sync.set({ download: to });
  };

  return (
    <div className="OptionsContainer">
      <div className="OptionEntry">
        <input
          type="checkbox"
          id="openInTab"
          name="openInTab"
          checked={openInTab}
          disabled={!download}
          onChange={() => openInNewTabClickedHandler(!openInTab)}
        />
        <label htmlFor="openInTab">Open screenshots in a new tab</label>
      </div>

      <div className="OptionEntry">
        <input
          type="checkbox"
          id="download"
          name="download"
          checked={download}
          disabled={!openInTab}
          onChange={() => downloadClickedHandler(!download)}
        />
        <label htmlFor="download">Directly download screenshots</label>
      </div>
    </div>
  );
};

export default Options;
