import { useCallback, useEffect, useState } from "react";
import { Shield, AlertTriangle, Eye, CheckCircle, XCircle, Search, AlertOctagon, MessageSquare, User, Building } from 'lucide-react';
import { API_BASE_URL, fetchWithAuth } from "../../config/api";
import DataTable from "../../components/admin/DataTable";
import AdminFilters from "../../components/admin/AdminFilters";
import StatusBadge from "../../components/admin/StatusBadge";

const DEFAULT_FILTERS = {
    type: '',
    status: '',
    severity: ''
};

const processStats = (todayStats = []) => {
    const stats = {
        total: 0,
        byType: { listing: 0, review: 0, account: 0, enquiry: 0 },
        bySeverity: { low: 0, medium: 0, high: 0, critical: 0 }
    };

    todayStats.forEach((stat) => {
        stats.total += stat.count;

        if (stat._id?.type) {
            stats.byType[stat._id.type] = (stats.byType[stat._id.type] || 0) + stat.count;
        }

        if (stat._id?.severity) {
            stats.bySeverity[stat._id.severity] = (stats.bySeverity[stat._id.severity] || 0) + stat.count;
        }
    });

    return stats;
};

const buildDashboardQuery = (filters, page, limit) => {
    const queryParams = new URLSearchParams({
        page: String(page),
        limit: String(limit)
    });

    Object.entries(filters).forEach(([key, value]) => {
        if (value) {
            queryParams.set(key, value);
        }
    });

    return queryParams.toString();
};

const FraudDashboard = () => {
    const [alerts, setAlerts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState(() => processStats());
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });
    const [error, setError] = useState(null);

    const fetchFraudData = useCallback(async (page = 1) => {
        try {
            setIsLoading(true);
            setError(null);
            const queryParams = buildDashboardQuery(filters, page, pagination.limit);

            const response = await fetchWithAuth(`${API_BASE_URL}/fraud/dashboard?${queryParams}`);

            if (!response.ok) throw new Error('Failed to fetch fraud data');

            const data = await response.json();
            setAlerts(data.alerts || []);
            setStats(processStats(data.todayStats || []));
            setPagination(prev => ({
                ...prev,
                page,
                total: data.pagination?.total || 0
            }));
        } catch (error) {
            console.error('Error fetching fraud data:', error);
            setError('Failed to load fraud dashboard');
        } finally {
            setIsLoading(false);
        }
    }, [filters, pagination.limit]);

    useEffect(() => {
        fetchFraudData(1);
    }, [filters, fetchFraudData]);

    const runDetection = async () => {
        try {
            setIsLoading(true);
            const response = await fetchWithAuth(`${API_BASE_URL}/fraud/run-detection`, {
                method: 'POST'
            });

            if (!response.ok) throw new Error('Failed to run detection');

            alert('Fraud detection scan completed');
            await fetchFraudData(pagination.page);
        } catch (error) {
            console.error('Error running detection:', error);
            setError('Failed to run fraud detection');
        } finally {
            setIsLoading(false);
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical': return 'bg-red-100 text-red-800 border-red-200';
            case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'listing': return <Building className="w-4 h-4" />;
            case 'review': return <MessageSquare className="w-4 h-4" />;
            case 'account': return <User className="w-4 h-4" />;
            case 'enquiry': return <Search className="w-4 h-4" />;
            default: return <AlertTriangle className="w-4 h-4" />;
        }
    };

    const columns = [
        {
            label: "Type",
            key: "type",
            render: (value, row) => (
                <div className="flex items-center gap-2">
                    {getTypeIcon(row.type)}
                    <span className="text-sm font-medium text-slate-900 capitalize">
                        {row.type}
                    </span>
                </div>
            )
        },
        {
            label: "Reason",
            key: "reason",
            render: (value, row) => (
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-800 truncate max-w-[200px]">{row.reason}</span>
                    <span className="text-[10px] text-slate-500 truncate max-w-[200px]">{row.description}</span>
                </div>
            )
        },
        {
            label: "Target",
            key: "targetId",
            render: (value, row) => (
                <div className="flex flex-col">
                    <span className="text-sm text-slate-700">
                        {row.targetId?.name || row.targetId?.title || row.targetId?.email || 'Unknown'}
                    </span>
                    <span className="text-[10px] uppercase tracking-wide text-slate-400">
                        {row.targetModel || 'Unassigned'}
                    </span>
                </div>
            )
        },
        {
            label: "Severity",
            key: "severity",
            render: (value, row) => (
                <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full border ${getSeverityColor(row.severity)}`}>
                    {row.severity?.toUpperCase()}
                </span>
            )
        },
        {
            label: "Status",
            key: "status",
            render: (value, row) => <StatusBadge status={row.status} />
        },
        {
            label: "Created",
            key: "createdAt",
            render: (value, row) => (
                <span className="text-xs text-slate-500">
                    {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'Unknown'}
                </span>
            )
        }
    ];

    const showWorkflowInfo = (alert, workflowLabel) => {
        window.alert(
            `${workflowLabel} is not enabled from the fraud dashboard yet for ${alert.type || 'this'} alerts.`
        );
    };

    const handleModeration = async (alert, action) => {
        const reason = window.prompt(`Enter reason for ${action.replace('_', ' ')}:`, alert.reason);
        if (reason === null) return;

        try {
            setIsLoading(true);
            const response = await fetchWithAuth(`${API_BASE_URL}/fraud/alerts/${alert._id}/moderate`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, reason })
            });

            if (!response.ok) throw new Error('Failed to moderate alert');

            await fetchFraudData(pagination.page);
            window.alert(`Decision: ${action.replace('_', ' ')} has been applied.`);
        } catch (error) {
            console.error('Moderation error:', error);
            setError('Failed to apply moderation action');
        } finally {
            setIsLoading(false);
        }
    };

    const tableActions = [
        {
            label: "Investigate",
            icon: Eye,
            onClick: async (alert) => {
                try {
                    const response = await fetchWithAuth(`${API_BASE_URL}/fraud/alerts/${alert._id}/assign`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ moderatorId: 'current' }) // Backend needs to handle 'current' or get from req.user
                    });
                    if (response.ok) await fetchFraudData(pagination.page);
                } catch (err) {
                    console.error('Assign error:', err);
                }
            },
            condition: alert => alert.status === 'pending'
        },
        {
            label: "Dismiss (Safe)",
            icon: CheckCircle,
            onClick: (alert) => handleModeration(alert, 'dismiss'),
            condition: alert => alert.status === 'investigating' || alert.status === 'pending'
        },
        {
            label: "Suspend Listing",
            icon: XCircle,
            onClick: (alert) => handleModeration(alert, 'suspend_listing'),
            isDangerous: true,
            condition: alert => alert.targetModel === 'Company' && alert.status !== 'confirmed'
        },
        {
            label: "Suspend Account",
            icon: Shield,
            onClick: (alert) => handleModeration(alert, 'suspend_account'),
            isDangerous: true,
            condition: alert => alert.targetModel === 'User' && alert.status !== 'confirmed'
        },
        {
            label: "Reject / Quarantine",
            icon: AlertOctagon,
            onClick: (alert) => handleModeration(alert, 'quarantine'),
            isDangerous: true,
            condition: alert => alert.targetModel === 'Review' && alert.status !== 'confirmed'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 italic flex items-center gap-2">
                        <Shield className="w-6 h-6 text-indigo-600" />
                        Fraud Monitoring
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Real-time fraud detection and alert management system</p>
                </div>
                <button
                    onClick={runDetection}
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-indigo-100"
                >
                    <AlertOctagon className="w-4 h-4" />
                    Run Detection Scan
                </button>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            {/* Today's Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-colors">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Alerts Today</p>
                    <div className="flex items-end justify-between">
                        <h4 className="text-3xl font-black text-slate-800 leading-none">{stats.total || 0}</h4>
                        <AlertTriangle className="w-8 h-8 text-rose-500 stroke-[3]" />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-colors">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Critical Alerts Today</p>
                    <div className="flex items-end justify-between">
                        <h4 className="text-3xl font-black text-rose-600 leading-none">{stats.bySeverity?.critical || 0}</h4>
                        <XCircle className="w-8 h-8 text-rose-500 stroke-[3]" />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-colors">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Listing Alerts Today</p>
                    <div className="flex items-end justify-between">
                        <h4 className="text-3xl font-black text-indigo-600 leading-none">{stats.byType?.listing || 0}</h4>
                        <Building className="w-8 h-8 text-indigo-500 stroke-[3]" />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-colors">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Account Alerts Today</p>
                    <div className="flex items-end justify-between">
                        <h4 className="text-3xl font-black text-emerald-600 leading-none">{stats.byType?.account || 0}</h4>
                        <User className="w-8 h-8 text-emerald-500 stroke-[3]" />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <AdminFilters
                filters={[
                    {
                        type: "select",
                        key: "type",
                        label: "Alert Type",
                        options: [
                            { label: "All Types", value: "" },
                            { label: "Listings", value: "listing" },
                            { label: "Reviews", value: "review" },
                            { label: "Accounts", value: "account" },
                            { label: "Enquiries", value: "enquiry" }
                        ],
                        value: filters.type
                    },
                    {
                        type: "select",
                        key: "status",
                        label: "Status",
                        options: [
                            { label: "All Status", value: "" },
                            { label: "Pending", value: "pending" },
                            { label: "Investigating", value: "investigating" },
                            { label: "Confirmed", value: "confirmed" },
                            { label: "Dismissed", value: "dismissed" }
                        ],
                        value: filters.status
                    },
                    {
                        type: "select",
                        key: "severity",
                        label: "Severity",
                        options: [
                            { label: "All Severity", value: "" },
                            { label: "Low", value: "low" },
                            { label: "Medium", value: "medium" },
                            { label: "High", value: "high" },
                            { label: "Critical", value: "critical" }
                        ],
                        value: filters.severity
                    }
                ]}
                onFilterChange={(key, value) => {
                    setFilters(prev => ({ ...prev, [key]: value }));
                    setPagination(prev => ({ ...prev, page: 1 }));
                }}
                onReset={() => {
                    setFilters(DEFAULT_FILTERS);
                }}
            />

            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                Moderator workflows are view-only on this dashboard. Use this screen to monitor alerts and queue follow-up work.
            </div>

            {/* DataTable */}
            <DataTable
                data={alerts}
                columns={columns}
                actions={tableActions}
                isLoading={isLoading}
                itemsPerPage={pagination.limit}
                currentPage={pagination.page}
                totalItems={pagination.total}
                onPageChange={(page) => fetchFraudData(page)}
                emptyMessage="No fraud alerts found for the selected filters."
            />
        </div>
    );
};

export default FraudDashboard;
