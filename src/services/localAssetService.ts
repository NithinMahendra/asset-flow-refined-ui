
import { MyAsset } from './employeeService';

export interface LocalAsset extends MyAsset {
  isLocal: boolean;
  scannedAt: string;
  localId: string;
}

export class LocalAssetService {
  private static STORAGE_KEY = 'scannedAssets';

  static getLocalAssets(userId: string): LocalAsset[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      
      const allAssets = JSON.parse(stored);
      return allAssets[userId] || [];
    } catch (error) {
      console.error('Error getting local assets:', error);
      return [];
    }
  }

  static addLocalAsset(userId: string, asset: MyAsset): boolean {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const allAssets = stored ? JSON.parse(stored) : {};
      
      if (!allAssets[userId]) {
        allAssets[userId] = [];
      }

      // Check if asset already exists locally
      const existingIndex = allAssets[userId].findIndex(
        (a: LocalAsset) => a.serial_number === asset.serial_number
      );

      const localAsset: LocalAsset = {
        ...asset,
        isLocal: true,
        scannedAt: new Date().toISOString(),
        localId: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      if (existingIndex >= 0) {
        // Update existing local asset
        allAssets[userId][existingIndex] = localAsset;
      } else {
        // Add new local asset
        allAssets[userId].push(localAsset);
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allAssets));
      return true;
    } catch (error) {
      console.error('Error adding local asset:', error);
      return false;
    }
  }

  static removeLocalAsset(userId: string, localId: string): boolean {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return false;
      
      const allAssets = JSON.parse(stored);
      if (!allAssets[userId]) return false;

      allAssets[userId] = allAssets[userId].filter(
        (asset: LocalAsset) => asset.localId !== localId
      );

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allAssets));
      return true;
    } catch (error) {
      console.error('Error removing local asset:', error);
      return false;
    }
  }

  static clearLocalAssets(userId: string): boolean {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return true;
      
      const allAssets = JSON.parse(stored);
      delete allAssets[userId];

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allAssets));
      return true;
    } catch (error) {
      console.error('Error clearing local assets:', error);
      return false;
    }
  }
}
