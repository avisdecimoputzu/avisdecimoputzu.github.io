class InstagramFeed {
    constructor() {
        this.accessToken = 'IL_TUO_TOKEN_QUI';
        this.userId = 'IL_TUO_ID_INSTAGRAM';
        this.lastCheckedPostId = null;
        this.checkInterval = 5 * 60 * 1000; // Controlla ogni 5 minuti
    }

    async getLatestPost() {
        try {
            const response = await fetch(
                `https://graph.instagram.com/${this.userId}/media?fields=id,permalink&access_token=${this.accessToken}&limit=1`
            );
            const data = await response.json();
            
            if (data.data && data.data[0]) {
                return {
                    id: data.data[0].id,
                    permalink: data.data[0].permalink
                };
            }
            return null;
        } catch (error) {
            console.error('Errore nel recupero del post Instagram:', error);
            return null;
        }
    }

    updateEmbedCode(permalink) {
        const blockquote = document.querySelector('.instagram-media');
        if (blockquote) {
            blockquote.setAttribute('data-instgrm-permalink', permalink);
            blockquote.querySelector('a').href = permalink;
            
            // Ricarica il widget di Instagram
            if (window.instgrm) {
                window.instgrm.Embeds.process();
            }
        }
    }

    async checkForNewPost() {
        const latestPost = await this.getLatestPost();
        
        if (latestPost && latestPost.id !== this.lastCheckedPostId) {
            this.lastCheckedPostId = latestPost.id;
            this.updateEmbedCode(latestPost.permalink);
        }
    }

    startChecking() {
        // Controlla subito all'avvio
        this.checkForNewPost();
        
        // Imposta il controllo periodico
        setInterval(() => this.checkForNewPost(), this.checkInterval);
    }
} 