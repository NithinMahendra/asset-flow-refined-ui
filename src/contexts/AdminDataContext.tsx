
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

interface QRCode {
  id: string;
  assetId: string;
  qrCode: string;
  generatedDate: string;
  lastScanned: string;
  scanCount: number;
  status: 'Active' | 'Inactive' | 'Expired';
}

interface AdminDataContextType {
  assets: Asset[];
  users: User[];
  assignments: Assignment[];
  assignmentRequests: AssignmentRequest[];
  notifications: Notification[];
  qrCodes: QRCode[];
  addAsset: (asset: Omit<Asset, 'id' | 'lastUpdated' | 'qrCode'>) => void;
  updateAsset: (id: string, updates: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  addAssignment: (assignment: Omit<Assignment, 'id'>) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  markNotificationAsRead: (id: string) => void;
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
  getRecentActivity: () => Array<{
    action: string;
    details: string;
    timestamp: string;
    type: string;
  }>;
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
      status: 'Available',
      assignee: '-',
      value: 2499,
      location: 'Warehouse A',
      lastUpdated: '2024-01-15',
      qrCode: 'QR001-AST001-2024',
      serialNumber: 'MP-2024-001',
      purchaseDate: '2024-01-10',
      warrantyExpiry: '2027-01-10',
      condition: 'Excellent'
    },
    {
      id: 'AST-002',
      name: 'iPhone 15 Pro',
      category: 'Mobile',
      status: 'Assigned',
      assignee: 'John Doe',
      value: 999,
      location: 'Office Floor 2',
      lastUpdated: '2024-01-14',
      qrCode: 'QR002-AST002-2024',
      serialNumber: 'IP-2024-002',
      purchaseDate: '2024-01-08',
      warrantyExpiry: '2026-01-08',
      condition: 'Excellent'
    },
    {
      id: 'AST-003',
      name: 'Dell Monitor 27"',
      category: 'Monitor',
      status: 'In Repair',
      assignee: '-',
      value: 329,
      location: 'IT Department',
      lastUpdated: '2024-01-13',
      qrCode: 'QR003-AST003-2024',
      serialNumber: 'DM-2024-003',
      purchaseDate: '2024-01-05',
      warrantyExpiry: '2026-01-05',
      condition: 'Fair'
    },
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
  ]);

  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: 'ASSIGN-001',
      employeeId: 'USR-001',
      employeeName: 'John Doe',
      employeeEmail: 'john.doe@company.com',
      assetId: 'AST-002',
      assetName: 'iPhone 15 Pro',
      assignedDate: '2024-01-14',
      dueDate: '2024-07-14',
      status: 'Active',
      department: 'Engineering',
      condition: 'Excellent'
    },
  ]);

  const [assignmentRequests, setAssignmentRequests] = useState<AssignmentRequest[]>([
    {
      id: 'REQ-001',
      employeeId: 'USR-003',
      employeeName: 'Alice Brown',
      employeeEmail: 'alice.brown@company.com',
      requestedAsset: 'iPad Pro',
      requestDate: '2024-01-16',
      priority: 'High',
      justification: 'Required for client presentations',
      department: 'Sales',
      managerId: 'USR-002',
      managerName: 'Sarah Smith',
      status: 'Pending'
    },
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);

  // Initialize QR codes and notifications
  useEffect(() => {
    // Generate QR codes for existing assets
    const initialQRCodes = assets.map(asset => ({
      id: `QR-${asset.id}`,
      assetId: asset.id,
      qrCode: asset.qrCode,
      generatedDate: asset.purchaseDate,
      lastScanned: asset.lastUpdated,
      scanCount: Math.floor(Math.random() * 20) + 1,
      status: 'Active' as const
    }));
    setQrCodes(initialQRCodes);

    // Generate initial notifications
    const initialNotifications = [
      {
        id: 'NOTIF-001',
        type: 'warning' as const,
        title: 'Asset Maintenance Due',
        message: `${assets[2]?.name} requires scheduled maintenance`,
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        isRead: false,
        assetId: assets[2]?.id
      },
      {
        id: 'NOTIF-002',
        type: 'info' as const,
        title: 'New Asset Request',
        message: 'Alice Brown requested a new iPad Pro',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        isRead: false
      },
    ];
    setNotifications(initialNotifications);
  }, []);

  const addAsset = (assetData: Omit<Asset, 'id' | 'lastUpdated' | 'qrCode'>) => {
    const assetId = `AST-${String(assets.length + 1).padStart(3, '0')}`;
    const qrCode = `QR${Date.now()}-${assetId}-${new Date().getFullYear()}`;
    
    const newAsset: Asset = {
      ...assetData,
      id: assetId,
      lastUpdated: new Date().toISOString().split('T')[0],
      qrCode
    };

    setAssets(prev => [...prev, newAsset]);

    // Add QR code
    const newQRCode: QRCode = {
      id: `QR-${assetId}`,
      assetId,
      qrCode,
      generatedDate: new Date().toISOString().split('T')[0],
      lastScanned: 'Never',
      scanCount: 0,
      status: 'Active'
    };
    setQrCodes(prev => [...prev, newQRCode]);

    // Add notification
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
  };

  const deleteAsset = (id: string) => {
    const asset = assets.find(a => a.id === id);
    setAssets(prev => prev.filter(asset => asset.id !== id));
    setQrCodes(prev => prev.filter(qr => qr.assetId !== id));
    
    if (asset) {
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
      assignee: assignmentData.employeeName 
    });
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
    const overdue = assignments.filter(a => a.status === 'Overdue').length;
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
    const activities = [];

    // Recent assignments
    assignments.slice(-5).forEach(assignment => {
      activities.push({
        action: 'Asset Assignment',
        details: `${assignment.assetName} assigned to ${assignment.employeeName}`,
        timestamp: assignment.assignedDate,
        type: 'assignment'
      });
    });

    // Recent asset additions
    assets.slice(-3).forEach(asset => {
      activities.push({
        action: 'New Asset Added',
        details: `${asset.name} added to inventory`,
        timestamp: asset.lastUpdated,
        type: 'addition'
      });
    });

    // Assets in repair
    assets.filter(a => a.status === 'In Repair').forEach(asset => {
      activities.push({
        action: 'Maintenance Request',
        details: `${asset.name} requires repair`,
        timestamp: asset.lastUpdated,
        type: 'maintenance'
      });
    });

    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5)
      .map(activity => ({
        ...activity,
        timestamp: new Date(activity.timestamp).toLocaleString()
      }));
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

    // Add some standard recurring tasks
    tasks.push(
      {
        task: 'Monthly Asset Audit',
        due: 'Due in 5 days',
        priority: 'medium' as const
      },
      {
        task: 'Quarterly Inventory Check',
        due: 'Due in 2 weeks',
        priority: 'low' as const
      }
    );

    return tasks.slice(0, 6);
  };

  const value: AdminDataContextType = {
    assets,
    users,
    assignments,
    assignmentRequests,
    notifications,
    qrCodes,
    addAsset,
    updateAsset,
    deleteAsset,
    addUser,
    addAssignment,
    addNotification,
    markNotificationAsRead,
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
