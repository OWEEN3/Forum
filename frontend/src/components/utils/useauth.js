import { useState, useEffect, useCallback } from "react";

export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/users/me", {
                method: "GET",
                credentials: "include",
            });

            if (response.status === 401) {
                setUser(null);
            } else if (response.ok) {
                const data = await response.json();
                setUser(data);
            } else {
                setUser(null);
            }
        } catch (err) {
            console.error("Auth check failed:", err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return { user, loading, isAuthenticated: !!user, refreshAuth: checkAuth };
}
