/**
 * Configuration PocketBase
 * Utilisé pour les scripts côté client et serveur
 */

export const getPocketBaseUrl = (): string => {
	// En développement
	if (import.meta.env?.MODE === 'development' || typeof window !== 'undefined' && window.location.hostname === 'localhost') {
		return 'http://127.0.0.1:8090';
	}
	// En production
	return 'https://portfolio.enzo-locatelli.fr';
};

// Pour les scripts côté client (compatibilité navigateur)
export const POCKETBASE_URL = typeof window !== 'undefined' 
	? (window.location.hostname === 'localhost' ? 'http://127.0.0.1:8090' : 'https://portfolio.enzo-locatelli.fr')
	: 'http://127.0.0.1:8090';
