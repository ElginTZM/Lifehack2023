function UploadInterface() {
    const [file, setFile] = React.useState('');
    const [dropDisplay, setDropDisplay] = React.useState('choose file');
    const [btnStyle, setBtnStyle] = React.useState({
        display: 'none'
    });
    const [displayMessage, setDisplayMessage] = React.useState(false);

    function newTextInput() {
        switchTab(1);
        documentManager.newDocument();
    }

    function newFileInput(event) {
        setFile(event.target.files[0]);
        setDropDisplay(event.target.value.replace(/.*[\/\\]/, ''));
        setBtnStyle({
            display: "inline-block"
        })
    }

    function submitPDF() {
        setDisplayMessage(true);
        const formData = new FormData();
        formData.append('file', file);
        fetch('/file_summary', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(response => {
                setDisplayMessage(false);
                switchTab(1);
                documentManager.newDocument(dropDisplay, response["input-text"], response.summary, true);
            });
    }

    return (
        <React.Fragment>
            <div class="searchbox">
                <form>
                    <input type="text" placeholder=" Search ..." name="search" />
                </form>
            </div>

            <h2>All documents</h2>

            <div class="all-documents">
                <div class="box">
                    <a href="javascript:void(0)" class="button" onClick={newTextInput}>New Text File</a>
                    <hr></hr>
                </div>
                <div class="box">
                    <div class="button">Upload Document</div>

                    <label for="document" class="drop-container">
                        <span class="drop-title">
                            <div className="drop-display">{dropDisplay}</div>
                            <div><button type='button' onClick={submitPDF} style={btnStyle}>Upload</button></div>
                            <div style={{display: displayMessage ? "inline-block" : "none"}}>Please wait a moment ...</div>
                        </span>
                        <input type="file" id="document" 
                            accept="application/msword, application/vnd.ms-powerpoint,
                        text/plain, application/pdf" required onChange={newFileInput}/>
                    </label>

                    <hr></hr>
                    <p>.pdf/word</p>
                </div>
                <div class="box">
                    <div class="button">Upload Video</div>
                    <label for="video" class="drop-container">
                        <span class="drop-title">choose file</span>
                        <input type="file" id="document" 
                            accept=".mp4" required />
                    </label>
                    <hr></hr>
                    <p>.mp4/link</p>
                </div>
            </div>
        </React.Fragment>
    )
}

ReactDOM.render(<UploadInterface />, document.querySelector("#upload-document"));