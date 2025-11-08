        // Animation des barres de compétences au chargement
        window.addEventListener('load', () => {
            const skillBars = document.querySelectorAll('.skill-progress');
            skillBars.forEach((bar, index) => {
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.width = width;
                }, index * 100);
            });
        });

        // Fonction de téléchargement PDF améliorée avec gestion multi-pages et liens cliquables
        async function telechargerPDF() {
            const btn = document.getElementById('downloadBtn');
            const element = document.getElementById('cv-content');
            
            // Désactiver le bouton et afficher le spinner
            btn.disabled = true;
            btn.classList.add('loading');

            try {
                // Créer le PDF avec jsPDF
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4',
                    compress: true
                });

                // Dimensions A4 en mm
                const pageWidth = 210;
                const pageHeight = 297;

                // Ajouter le texte et les liens de manière native (pour la sélection et les clics)
                pdf.setFont("helvetica");
                
                // Header - Nom
                pdf.setFontSize(32);
                pdf.setFont("helvetica", "bold");
                pdf.setTextColor(15, 23, 42);
                
                // Titre et infos de contact
                pdf.setFontSize(14);
                pdf.setFont("helvetica", "normal");
                
                // Ajouter les liens cliquables
                pdf.textWithLink('izayid.ali@gmail.com', 15, 40, { url: 'mailto:izayid.ali@gmail.com' });
                pdf.textWithLink('github.com/izayid-ali', 15, 45, { url: 'https://github.com/izayid-ali' });

                // Maintenant capturer le contenu avec html2canvas pour le design
                const canvas = await html2canvas(element, {
                    scale: 2,
                    useCORS: true,
                    logging: false,
                    backgroundColor: '#ffffff'
                });

                // Calculer les dimensions de l'image
                const imgWidth = pageWidth;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                
                // Si l'image est plus grande qu'une page, on la découpe
                const totalPages = Math.ceil(imgHeight / pageHeight);
                
                const imgData = canvas.toDataURL('image/png', 1.0);
                
                // Créer un nouveau PDF pour l'image
                const pdfFinal = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4'
                });

                for (let page = 0; page < totalPages; page++) {
                    if (page > 0) {
                        pdfFinal.addPage();
                    }
                    
                    const yOffset = -(page * pageHeight);
                    pdfFinal.addImage(imgData, 'PNG', 0, yOffset, imgWidth, imgHeight, '', 'FAST');
                    
                    // Ajouter les liens cliquables sur chaque page (invisibles mais cliquables)
                    if (page === 0) {
                        // Zone email (ajuster les coordonnées selon votre layout)
                        pdfFinal.link(60, 32, 80, 6, { url: 'mailto:izayid.ali@gmail.com' });
                        // Zone GitHub
                        pdfFinal.link(155, 32, 50, 6, { url: 'https://github.com/izayid-ali' });
                    }
                }

                // Télécharger le PDF
                pdfFinal.save('CV_Izayid_Ali_Developpeur_Full_Stack.pdf');

                // Réactiver le bouton
                setTimeout(() => {
                    btn.disabled = false;
                    btn.classList.remove('loading');
                }, 1000);

            } catch (error) {
                console.error('Erreur lors de la génération du PDF:', error);
                alert('Une erreur est survenue lors de la génération du PDF. Veuillez réessayer.');
                btn.disabled = false;
                btn.classList.remove('loading');
            }
        }
