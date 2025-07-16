document.addEventListener('DOMContentLoaded', () => {
    const dropzone = document.querySelector('.dropzone');
    const fileInput = document.getElementById('fileInput');
    const dragOverlay = document.getElementById('dragOverlay');
    const fileListContainer = document.getElementById('fileListContainer');
    const sendFilesBtn = document.getElementById('sendFilesBtn');
    const uploadProgress = document.getElementById('uploadProgress');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const errorMessage = document.getElementById('errorMessage');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const successModal = document.getElementById('successModal');
    const closeModal = document.getElementById('closeModal');
    const scanQrBtn = document.getElementById('scanQrBtn');
    const qrReader = document.getElementById('qr-reader');

    let selectedFiles = [];

    // Supported file formats
    const supportedFormats = {
        'application/pdf': 'file-pdf',
        'image/jpeg': 'file-image',
        'image/png': 'file-image',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'file-word',
        'application/x-msdownload': 'file-code', // Representando TROYANO como un tipo genérico de ejecutable
        'text/plain': 'file-alt' // Ejemplo de otro tipo de archivo genérico
    };

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    // Highlight drop zone on drag enter/over
    ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, highlight, false);
    });

    // Remove highlight on drag leave/drop
    ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, unhighlight, false);
    });

    // Handle file drop
    dropzone.addEventListener('drop', handleDrop, false);
    fileInput.addEventListener('change', handleFileSelect, false);

    // Send files button click
    sendFilesBtn.addEventListener('click', uploadFiles);

    // Close success modal
    closeModal.addEventListener('click', () => {
        successModal.classList.remove('active');
        resetUploadState();
    });

    if (scanQrBtn && qrReader) {
        let html5QrCode;
        scanQrBtn.addEventListener('click', () => {
            qrReader.style.display = 'block';
            scanQrBtn.style.display = 'none';
            html5QrCode = new Html5Qrcode("qr-reader");
            html5QrCode.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: 250
                },
                qrCodeMessage => {
                    // Aquí tienes el contenido del QR escaneado
                    html5QrCode.stop();
                    qrReader.style.display = 'none';
                    scanQrBtn.style.display = 'block';
                    // Puedes enviar el hash al backend para verificarlo
                    fetch('https://unitrack-backend-h54d.onrender.com/qr/verificarExpiracion', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ hash: qrCodeMessage}) // Cambia 'TU_TIPO' según tu lógica
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.mensaje) {
                            showSuccessModal();
                            // Puedes mostrar info adicional aquí
                        } else {
                            showErrorMessage(data.error || 'QR no válido.');
                        }
                    })
                    .catch(err => {
                        showErrorMessage('Error al verificar el QR: ' + err.message);
                    });
                },
                errorMessage => {
                    // Puedes mostrar errores de escaneo aquí si quieres
                }
            );
        });
    }

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight(e) {
        dropzone.classList.add('highlight');
        dragOverlay.style.opacity = '1';
        dragOverlay.style.visibility = 'visible';
    }

    function unhighlight(e) {
        dropzone.classList.remove('highlight');
        dragOverlay.style.opacity = '0';
        dragOverlay.style.visibility = 'hidden';
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        addFilesToList(files);
    }

    function handleFileSelect(e) {
        const files = e.target.files;
        addFilesToList(files);
    }

    function addFilesToList(files) {
        hideErrorMessage();
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (validateFile(file)) {
                // Check if file already exists in the list (by name and size, simple check)
                const isDuplicate = selectedFiles.some(existingFile => 
                    existingFile.name === file.name && existingFile.size === file.size
                );
                if (!isDuplicate) {
                    selectedFiles.push(file);
                }
            } else {
                showErrorMessage(`El archivo '${file.name}' tiene un formato no soportado. Formatos permitidos: PDF, JPG, PNG, DOCX y TROYANO.`);
            }
        }
        renderFileList();
        fileInput.value = ''; // Clear file input after selection
    }

    function validateFile(file) {
        return supportedFormats.hasOwnProperty(file.type);
    }

    function renderFileList() {
        fileListContainer.innerHTML = ''; // Clear existing list
        if (selectedFiles.length === 0) {
            sendFilesBtn.style.display = 'none';
            return;
        }

        selectedFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.classList.add('file-item');
            fileItem.innerHTML = `
                <div class="file-item-details">
                    <i class="fas fa-${supportedFormats[file.type] || 'file'}"></i>
                    <span class="file-item-name">${file.name}</span>
                </div>
                <span class="file-item-size">${formatFileSize(file.size)}</span>
                <button class="remove-file-btn" data-index="${index}"><i class="fas fa-times-circle"></i></button>
            `;
            fileListContainer.appendChild(fileItem);

            // Add event listener to remove button
            fileItem.querySelector('.remove-file-btn').addEventListener('click', (e) => {
                const indexToRemove = parseInt(e.currentTarget.dataset.index);
                removeFile(indexToRemove);
            });
        });
        sendFilesBtn.style.display = 'block';
    }

    function removeFile(index) {
        selectedFiles.splice(index, 1);
        renderFileList();
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function uploadFiles() {
        if (selectedFiles.length === 0) {
            showErrorMessage('Por favor, selecciona al menos un archivo para enviar.');
            return;
        }

        // Hide file list and show loading/progress
        fileListContainer.innerHTML = ''; // Clear file list on send
        sendFilesBtn.style.display = 'none';
        errorMessage.classList.remove('active');
        loadingSpinner.classList.remove('active');
        uploadProgress.classList.add('active');
        progressBar.style.width = '0%';
        progressText.textContent = '0%';

        let progress = 0;
        const totalProgressSteps = 100 / selectedFiles.length; // Progress per file

        let currentFileIndex = 0;

        const simulateFileUpload = () => {
            if (currentFileIndex < selectedFiles.length) {
                // Simulate individual file upload progress if needed, for simplicity, we do overall progress
                progress += totalProgressSteps;
                if (progress > 100) progress = 100;

                progressBar.style.width = progress + '%';
                progressText.textContent = Math.round(progress) + '%';
                currentFileIndex++;
                setTimeout(simulateFileUpload, 500); // Simulate next file upload after 0.5 sec
            } else {
                // All files processed
                uploadProgress.classList.remove('active');
                showSuccessModal();
                resetUploadState(); // Reset state after successful upload
            }
        };

        setTimeout(simulateFileUpload, 500); // Start the first file upload simulation

        // Here you would typically send files to the server using FormData and fetch/XMLHttpRequest
        // Example (conceptual):
        /*
        const formData = new FormData();
        selectedFiles.forEach(file => {
            formData.append('files', file);
        });

        fetch('/upload-endpoint', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            loadingSpinner.classList.remove('active');
            uploadProgress.classList.remove('active');
            showSuccessModal();
            resetUploadState();
        })
        .catch(error => {
            loadingSpinner.classList.remove('active');
            uploadProgress.classList.remove('active');
            showErrorMessage('Error al subir los archivos: ' + error.message);
            resetUploadState();
        });
        */
    }

    function showSuccessModal() {
        successModal.classList.add('active');
    }

    function showErrorMessage(message) {
        errorMessage.textContent = message;
        errorMessage.classList.add('active');
    }

    function hideErrorMessage() {
        errorMessage.classList.remove('active');
        errorMessage.textContent = '';
    }

    function resetUploadState() {
        fileInput.value = '';
        selectedFiles = []; // Clear the array of selected files
        renderFileList(); // Re-render to clear the displayed list
        loadingSpinner.classList.remove('active');
        uploadProgress.classList.remove('active');
        progressBar.style.width = '0%';
        progressText.textContent = '0%';
        hideErrorMessage();
    }
});