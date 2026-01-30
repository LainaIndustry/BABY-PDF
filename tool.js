// PDF Processing Functions

class PDFProcessor {
    constructor() {
        this.files = [];
        this.progress = 0;
        this.isProcessing = false;
    }

    // Initialize file upload
    initFileUpload(uploadArea, fileList) {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.multiple = true;
        fileInput.accept = '.pdf';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);

        uploadArea.addEventListener('click', () => fileInput.click());
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#ff5a5f';
            uploadArea.style.backgroundColor = '#f8f9fa';
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = '#dfe6e9';
            uploadArea.style.backgroundColor = 'transparent';
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#dfe6e9';
            uploadArea.style.backgroundColor = 'transparent';
            this.handleFiles(e.dataTransfer.files, fileList);
        });

        fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files, fileList);
        });

        return fileInput;
    }

    // Handle uploaded files
    handleFiles(fileList, container) {
        const files = Array.from(fileList).filter(file => 
            file.type === 'application/pdf' || 
            file.name.toLowerCase().endsWith('.pdf')
        );

        if (files.length === 0) {
            this.showMessage('Please select PDF files only', 'error');
            return;
        }

        files.forEach(file => {
            this.addFile(file, container);
        });

        this.updateFileCount();
    }

    // Add file to list
    addFile(file, container) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div class="file-info">
                <i class="fas fa-file-pdf file-icon"></i>
                <div>
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${this.formatFileSize(file.size)}</div>
                </div>
            </div>
            <button class="remove-file" onclick="pdfProcessor.removeFile(this)">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(fileItem);
        this.files.push({
            element: fileItem,
            file: file
        });
    }

    // Remove file from list
    removeFile(button) {
        const fileItem = button.closest('.file-item');
        const index = this.files.findIndex(f => f.element === fileItem);
        
        if (index !== -1) {
            this.files.splice(index, 1);
            fileItem.remove();
            this.updateFileCount();
        }
    }

    // Update file count display
    updateFileCount() {
        const fileCount = this.files.length;
        const countElement = document.getElementById('fileCount');
        if (countElement) {
            countElement.textContent = `${fileCount} file${fileCount !== 1 ? 's' : ''} selected`;
        }
        
        // Enable/disable process button
        const processBtn = document.getElementById('processBtn');
        if (processBtn) {
            processBtn.disabled = fileCount === 0;
        }
    }

    // Format file size
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Show progress bar
    showProgress(show = true) {
        const progressContainer = document.getElementById('progressContainer');
        const progressBar = document.getElementById('progressBar');
        
        if (progressContainer) {
            progressContainer.style.display = show ? 'block' : 'none';
        }
        
        if (show) {
            this.progress = 0;
            this.updateProgress(0);
        }
    }

    // Update progress bar
    updateProgress(percentage) {
        this.progress = percentage;
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
        
        if (progressText) {
            progressText.textContent = `Processing... ${percentage}%`;
        }
    }

    // Show message
    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            ${message}
        `;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'error' ? '#d63031' : '#00b894'};
            color: white;
            border-radius: 8px;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => messageDiv.remove(), 300);
        }, 3000);
    }

    // Simulate processing (for demo)
    simulateProcessing(duration = 3000) {
        return new Promise(resolve => {
            this.isProcessing = true;
            this.showProgress(true);
            
            let progress = 0;
            const interval = setInterval(() => {
                progress += 5;
                this.updateProgress(Math.min(progress, 100));
                
                if (progress >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        this.showProgress(false);
                        this.isProcessing = false;
                        resolve();
                    }, 500);
                }
            }, duration / 20);
        });
    }

    // Download processed file
    downloadFile(fileName, content) {
        const blob = new Blob([content], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Reset processor
    reset() {
        this.files.forEach(item => item.element.remove());
        this.files = [];
        this.updateFileCount();
        this.showProgress(false);
        this.showMessage('Reset successful', 'success');
    }
}

// Initialize global PDF processor
const pdfProcessor = new PDFProcessor();

// CSS for fade animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-20px); }
    }
`;
document.head.appendChild(style);
