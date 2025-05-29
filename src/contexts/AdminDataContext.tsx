
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Asset {
  id: string;
  name: string;
  category: string;
  status: 'Available' | 'Assigned' | 'In Repair' | 'Retired';
  assignee: string;
  value: number;
  location: string;
  lastUpdated: string;
  qrCode: string;
  serialNumber: string;
  purchaseDate: string;
  warrantyExpiry: string;
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  brand?: string;
  model?: string;
  department?: string;
  description?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Employee' | 'Manager' | 'Admin';
  department: string;
  joinDate: string;
  status: 'Active' | 'Inactive';
}

interface Assignment {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  assetId: string;
  assetName: string;
  assignedDate: string;
  dueDate: string;
  status: 'Active' | 'Pending Return' | 'Returned' | 'Overdue';
  department: string;
  condition: string;
}

interface AssignmentRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  requestedAsset: string;
  requestDate: string;
  priority: 'High' | 'Medium' | 'Low';
  justification: string;
  department: string;
  managerId: string;
  managerName: string;
  status: 'Pending' | 'Approved' | 'Declined';
}

interface Notification {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  assetId?: string;
  userId?: string;
}

interface ActivityLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  type: 'assignment' | 'addition' | 'maintenance' | 'return' | 'update';
  userId?: string;
  assetId?: string;
}

interface AdminDataContextType {
  assets: Asset[];
  users: User[];
  assignments: Assignment[];
  assignmentRequests: AssignmentRequest[];
  notifications: Notification[];
  activityLog: ActivityLog[];
  addAsset: (asset: Omit<Asset, 'id' | 'lastUpdated' | 'qrCode'>) => void;
  updateAsset: (id: string, updates: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  addAssignment: (assignment: Omit<Assignment, 'id'>) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  markNotificationAsRead: (id: string) => void;
  approveAssignmentRequest: (id: string) => void;
  declineAssignmentRequest: (id: string) => void;
  generateQRCode: (assetId: string) => string;
  getAssetStats: () => {
    total: number;
    available: number;
    assigned: number;
    inRepair: number;
    retired: number;
    totalValue: number;
  };
  getCategoryStats: () => Array<{
    name: string;
    count: number;
    value: number;
  }>;
  getAssignmentStats: () => {
    active: number;
    pending: number;
    overdue: number;
    completed: number;
  };
  getUtilizationRate: () => number;
  getMaintenanceRate: () => number;
  getAverageAssetAge: () => number;
  getUpcomingWarrantyExpiries: () => Asset[];
  getOverdueMaintenanceAssets: () => Asset[];
  getRecentActivity: () => ActivityLog[];
  getUpcomingTasks: () => Array<{
    task: string;
    due: string;
    priority: 'high' | 'medium' | 'low';
    count?: number;
  }>;
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
};

export const AdminDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: 'AST-001',
      name: 'MacBook Pro M3',
      category: 'Laptop',
      status: 'Assigned',
      assignee: 'John Doe',
      value: 2499,
      location: 'Office Floor 2',
      lastUpdated: new Date().toISOString().split('T')[0],
      qrCode: 'QR001-AST001-2024',
      serialNumber: 'MP-2024-001',
      purchaseDate: '2024-01-10',
      warrantyExpiry: '2027-01-10',
      condition: 'Excellent',
      brand: 'Apple',
      model: 'MacBook Pro 16-inch',
      department: 'Engineering'
    },
    {
      id: 'AST-002',
      name: 'Dell XPS 13',
      category: 'Laptop',
      status: 'Available',
      assignee: '-',
      value: 1299,
      location: 'Warehouse A',
      lastUpdated: new Date().toISOString().split('T')[0],
      qrCode: 'QR002-AST002-2024',
      serialNumber: 'DX-2024-002',
      purchaseDate: '2024-02-15',
      warrantyExpiry: '2027-02-15',
      condition: 'Excellent',
      brand: 'Dell',
      model: 'XPS 13',
      department: '-'
    },
    {
      id: 'AST-003',
      name: 'iPhone 15 Pro',
      category: 'Mobile',
      status: 'In Repair',
      assignee: '-',
      value: 999,
      location: 'IT Department',
      lastUpdated: new Date().toISOString().split('T')[0],
      qrCode: 'QR003-AST003-2024',
      serialNumber: 'IP-2024-003',
      purchaseDate: '2024-03-20',
      warrantyExpiry: '2025-03-20',
      condition: 'Fair',
      brand: 'Apple',
      model: 'iPhone 15 Pro',
      department: '-'
    }
  ]);

  const [users, setUsers] = useState<User[]>([
    {
      id: 'USR-001',
      name: 'John Doe',
      email: 'john.doe@company.com',
      role: 'Employee',
      department: 'Engineering',
      joinDate: '2023-06-15',
      status: 'Active'
    },
    {
      id: 'USR-002',
      name: 'Sarah Smith',
      email: 'sarah.smith@company.com',
      role: 'Manager',
      department: 'Marketing',
      joinDate: '2023-03-20',
      status: 'Active'
    },
    {
      id: 'USR-003',
      name: 'Mike Johnson',
      email: 'mike.johnson@company.com',
      role: 'Employee',
      department: 'Sales',
      joinDate: '2023-08-10',
      status: 'Active'
    }
  ]);

  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: 'ASSIGN-001',
      employeeId: 'USR-001',
      employeeName: 'John Doe',
      employeeEmail: 'john.doe@company.com',
      assetId: 'AST-001',
      assetName: 'MacBook Pro M3',
      assignedDate: '2024-01-14',
      dueDate: '2024-07-14',
      status: 'Active',
      department: 'Engineering',
      condition: 'Excellent'
    }
  ]);

  const [assignmentRequests, setAssignmentRequests] = useState<AssignmentRequest[]>([
    {
      id: 'REQ-001',
      employeeId: 'USR-003',
      employeeName: 'Mike Johnson',
      employeeEmail: 'mike.johnson@company.com',
      requestedAsset: 'Dell XPS 13',
      requestDate: new Date().toISOString().split('T')[0],
      priority: 'High',
      justification: 'Required for client presentations',
      department: 'Sales',
      managerId: 'USR-002',
      managerName: 'Sarah Smith',
      status: 'Pending'
    }
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'NOTIF-001',
      type: 'warning',
      title: 'Asset Maintenance Due',
      message: 'iPhone 15 Pro requires scheduled maintenance',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      isRead: false,
      assetId: 'AST-003'
    },
    {
      id: 'NOTIF-002',
      type: 'info',
      title: 'New Asset Request',
      message: 'Mike Johnson requested a Dell XPS 13',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      isRead: false
    }
  ]);

  const [activityLog, setActivityLog] = useState<ActivityLog[]>([
    {
      id: 'ACT-001',
      action: 'Asset Assignment',
      details: 'MacBook Pro M3 assigned to John Doe',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      type: 'assignment',
      assetId: 'AST-001',
      userId: 'USR-001'
    },
    {
      id: 'ACT-002',
      action: 'Maintenance Request',
      details: 'iPhone 15 Pro sent for repair',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      type: 'maintenance',
      assetId: 'AST-003'
    }
  ]);

  const generateAssetId = () => {
    const nextId = assets.length + 1;
    return `AST-${String(nextId).padStart(3, '0')}`;
  };

  const generateQRCode = (assetId: string) => {
    const timestamp = Date.now();
    return `QR${timestamp}-${assetId}-${new Date().getFullYear()}`;
  };

  const logActivity = (action: string, details: string, type: ActivityLog['type'], assetId?: string, userId?: string) => {
    const newActivity: ActivityLog = {
      id: `ACT-${String(activityLog.length + 1).padStart(3, '0')}`,
      action,
      details,
      timestamp: new Date().toISOString(),
      type,
      assetId,
      userId
    };
    setActivityLog(prev => [newActivity, ...prev.slice(0, 49)]); // Keep last 50 activities
  };

  const addAsset = (assetData: Omit<Asset, 'id' | 'lastUpdated' | 'qrCode'>) => {
    const assetId = generateAssetId();
    const qrCode = generateQRCode(assetId);
    
    const newAsset: Asset = {
      ...assetData,
      id: assetId,
      lastUpdated: new Date().toISOString().split('T')[0],
      qrCode
    };

    setAssets(prev => [...prev, newAsset]);
    logActivity('New Asset Added', `${newAsset.name} added to inventory`, 'addition', assetId);
    
    addNotification({
      type: 'success',
      title: 'New Asset Added',
      message: `${newAsset.name} has been added to inventory`,
      assetId: assetId
    });
  };

  const updateAsset = (id: string, updates: Partial<Asset>) => {
    setAssets(prev => prev.map(asset => 
      asset.id === id 
        ? { ...asset, ...updates, lastUpdated: new Date().toISOString().split('T')[0] }
        : asset
    ));
    
    const asset = assets.find(a => a.id === id);
    if (asset) {
      logActivity('Asset Updated', `${asset.name} information updated`, 'update', id);
    }
  };

  const deleteAsset = (id: string) => {
    const asset = assets.find(a => a.id === id);
    setAssets(prev => prev.filter(asset => asset.id !== id));
    
    if (asset) {
      logActivity('Asset Removed', `${asset.name} removed from inventory`, 'update', id);
      addNotification({
        type: 'info',
        title: 'Asset Removed',
        message: `${asset.name} has been removed from inventory`
      });
    }
  };

  const addUser = (userData: Omit<User, 'id'>) => {
    const userId = `USR-${String(users.length + 1).padStart(3, '0')}`;
    const newUser: User = { ...userData, id: userId };
    setUsers(prev => [...prev, newUser]);
  };

  const addAssignment = (assignmentData: Omit<Assignment, 'id'>) => {
    const assignmentId = `ASSIGN-${String(assignments.length + 1).padStart(3, '0')}`;
    const newAssignment: Assignment = { ...assignmentData, id: assignmentId };
    setAssignments(prev => [...prev, newAssignment]);

    // Update asset status
    updateAsset(assignmentData.assetId, { 
      status: 'Assigned', 
      assignee: assignmentData.employeeName,
      department: assignmentData.department
    });

    logActivity('Asset Assignment', `${assignmentData.assetName} assigned to ${assignmentData.employeeName}`, 'assignment', assignmentData.assetId, assignmentData.employeeId);
  };

  const addNotification = (notificationData: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const notificationId = `NOTIF-${String(notifications.length + 1).padStart(3, '0')}`;
    const newNotification: Notification = {
      ...notificationData,
      id: notificationId,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  };

  const approveAssignmentRequest = (id: string) => {
    const request = assignmentRequests.find(r => r.id === id);
    if (request) {
      const availableAsset = assets.find(a => 
        a.name.toLowerCase().includes(request.requestedAsset.toLowerCase()) && 
        a.status === 'Available'
      );
      
      if (availableAsset) {
        addAssignment({
          employeeId: request.employeeId,
          employeeName: request.employeeName,
          employeeEmail: request.employeeEmail,
          assetId: availableAsset.id,
          assetName: availableAsset.name,
          assignedDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 6 months
          status: 'Active',
          department: request.department,
          condition: availableAsset.condition
        });
      }
      
      setAssignmentRequests(prev => prev.map(r => 
        r.id === id ? { ...r, status: 'Approved' as const } : r
      ));
    }
  };

  const declineAssignmentRequest = (id: string) => {
    setAssignmentRequests(prev => prev.map(r => 
      r.id === id ? { ...r, status: 'Declined' as const } : r
    ));
  };

  const getAssetStats = () => {
    const total = assets.length;
    const available = assets.filter(a => a.status === 'Available').length;
    const assigned = assets.filter(a => a.status === 'Assigned').length;
    const inRepair = assets.filter(a => a.status === 'In Repair').length;
    const retired = assets.filter(a => a.status === 'Retired').length;
    const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);

    return { total, available, assigned, inRepair, retired, totalValue };
  };

  const getCategoryStats = () => {
    const categories = assets.reduce((acc, asset) => {
      if (!acc[asset.category]) {
        acc[asset.category] = { count: 0, value: 0 };
      }
      acc[asset.category].count++;
      acc[asset.category].value += asset.value;
      return acc;
    }, {} as Record<string, { count: number; value: number }>);

    return Object.entries(categories).map(([name, data]) => ({
      name,
      count: data.count,
      value: data.value
    }));
  };

  const getAssignmentStats = () => {
    const active = assignments.filter(a => a.status === 'Active').length;
    const pending = assignmentRequests.filter(r => r.status === 'Pending').length;
    const overdue = assignments.filter(a => {
      const dueDate = new Date(a.dueDate);
      return dueDate < new Date() && a.status === 'Active';
    }).length;
    const completed = assignments.filter(a => a.status === 'Returned').length;

    return { active, pending, overdue, completed };
  };

  const getUtilizationRate = () => {
    const total = assets.length;
    const inUse = assets.filter(a => a.status === 'Assigned').length;
    return total > 0 ? (inUse / total) * 100 : 0;
  };

  const getMaintenanceRate = () => {
    const total = assets.length;
    const inRepair = assets.filter(a => a.status === 'In Repair').length;
    return total > 0 ? (inRepair / total) * 100 : 0;
  };

  const getAverageAssetAge = () => {
    if (assets.length === 0) return 0;
    
    const currentDate = new Date();
    const totalAge = assets.reduce((sum, asset) => {
      const purchaseDate = new Date(asset.purchaseDate);
      const ageInYears = (currentDate.getTime() - purchaseDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
      return sum + ageInYears;
    }, 0);

    return totalAge / assets.length;
  };

  const getUpcomingWarrantyExpiries = () => {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    return assets.filter(asset => {
      const warrantyDate = new Date(asset.warrantyExpiry);
      const today = new Date();
      return warrantyDate > today && warrantyDate <= thirtyDaysFromNow;
    });
  };

  const getOverdueMaintenanceAssets = () => {
    return assets.filter(asset => asset.status === 'In Repair');
  };

  const getRecentActivity = () => {
    return activityLog.slice(0, 10);
  };

  const getUpcomingTasks = () => {
    const tasks = [];
    
    const upcomingWarranties = getUpcomingWarrantyExpiries();
    if (upcomingWarranties.length > 0) {
      tasks.push({
        task: 'Warranty Renewals Due',
        due: `${upcomingWarranties.length} assets expiring soon`,
        priority: 'high' as const,
        count: upcomingWarranties.length
      });
    }

    const overdueAssets = getOverdueMaintenanceAssets();
    if (overdueAssets.length > 0) {
      tasks.push({
        task: 'Maintenance Required',
        due: `${overdueAssets.length} assets need attention`,
        priority: 'high' as const,
        count: overdueAssets.length
      });
    }

    const pendingRequests = assignmentRequests.filter(r => r.status === 'Pending');
    if (pendingRequests.length > 0) {
      tasks.push({
        task: 'Pending Assignment Requests',
        due: `${pendingRequests.length} requests awaiting approval`,
        priority: 'medium' as const,
        count: pendingRequests.length
      });
    }

    return tasks.slice(0, 6);
  };

  const value: AdminDataContextType = {
    assets,
    users,
    assignments,
    assignmentRequests,
    notifications,
    activityLog,
    addAsset,
    updateAsset,
    deleteAsset,
    addUser,
    addAssignment,
    addNotification,
    markNotificationAsRead,
    approveAssignmentRequest,
    declineAssignmentRequest,
    generateQRCode,
    getAssetStats,
    getCategoryStats,
    getAssignmentStats,
    getUtilizationRate,
    getMaintenanceRate,
    getAverageAssetAge,
    getUpcomingWarrantyExpiries,
    getOverdueMaintenanceAssets,
    getRecentActivity,
    getUpcomingTasks
  };

  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  );
};
