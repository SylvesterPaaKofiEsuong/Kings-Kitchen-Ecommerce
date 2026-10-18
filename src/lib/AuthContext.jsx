import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'kingskitchen_auth_v1';
const USERS_KEY = 'kingskitchen_users_v1';

function loadUsers() {
  try {
    const data = localStorage.getItem(USERS_KEY) || localStorage.getItem('makings_users_v1');
    return JSON.parse(data) || [];
  } catch {
    return [];
  }
}
function saveUsers(users) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }
function loadSession() {
  try {
    const data = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('makings_auth_v1');
    return JSON.parse(data);
  } catch {
    return null;
  }
}
function saveSession(session) { localStorage.setItem(STORAGE_KEY, JSON.stringify(session)); }
function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem('makings_auth_v1');
}
const generateId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

// Seed an admin user
function ensureAdminUser() {
  const users = loadUsers();
  const existing = users.find(
    (u) => u.email === 'admin@kingskitchen.com.gh' || u.email === 'admin@makings.com.gh'
  );
  if (!existing) {
    users.push({
      id: 'user-admin',
      email: 'admin@kingskitchen.com.gh',
      password: 'admin123',
      full_name: "King's Kitchen Admin",
      role: 'admin',
      phone: '',
      saved_addresses: [],
      created_date: new Date().toISOString(),
    });
    saveUsers(users);
  } else {
    // Keep updated branding
    existing.email = 'admin@kingskitchen.com.gh';
    existing.full_name = "King's Kitchen Admin";
    saveUsers(users);
  }
}
ensureAdminUser();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);

  const checkUserAuth = useCallback(() => {
    setIsLoadingAuth(true);
    const session = loadSession();
    if (session?.user) {
      // Refresh from users store (to get latest phone/addresses)
      const users = loadUsers();
      const fresh = users.find((u) => u.id === session.user.id);
      const u = fresh ? { ...fresh } : session.user;
      delete u.password;
      setUser(u);
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
    setIsLoadingAuth(false);
    setAuthChecked(true);
  }, []);

  useEffect(() => { checkUserAuth(); }, [checkUserAuth]);

  const login = useCallback(async (email, password) => {
    const users = loadUsers();
    const cleanEmail = email.trim().toLowerCase();
    const found = users.find(
      (u) =>
        (u.email.toLowerCase() === cleanEmail ||
          (cleanEmail === 'admin@makings.com.gh' && u.email.toLowerCase() === 'admin@kingskitchen.com.gh') ||
          (cleanEmail === 'admin@kingskitchen.com.gh' && u.email.toLowerCase() === 'admin@makings.com.gh')) &&
        u.password === password
    );
    if (!found) throw new Error('Invalid email or password.');
    const u = { ...found };
    delete u.password;
    setUser(u);
    setIsAuthenticated(true);
    setAuthChecked(true);
    saveSession({ user: u });
    return u;
  }, []);

  const register = useCallback(async ({ email, password, full_name }) => {
    const users = loadUsers();
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with this email already exists.');
    }
    const newUser = {
      id: generateId(),
      email,
      password,
      full_name,
      role: 'user',
      phone: '',
      saved_addresses: [],
      created_date: new Date().toISOString(),
    };
    users.push(newUser);
    saveUsers(users);
    return { pendingEmail: email };
  }, []);

  const verifyOtp = useCallback(async ({ email, otpCode }) => {
    // Simulate OTP verification — any 6-digit code works in dev
    if (otpCode.length !== 6) throw new Error('Invalid code.');
    const users = loadUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) throw new Error('User not found.');
    const u = { ...found };
    delete u.password;
    setUser(u);
    setIsAuthenticated(true);
    setAuthChecked(true);
    saveSession({ user: u });
    return { access_token: 'sim_token' };
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    setIsAuthenticated(false);
    setAuthChecked(false);
    window.location.href = '/login';
  }, []);

  const navigateToLogin = useCallback(() => {
    window.location.href = '/login';
  }, []);

  const updateMe = useCallback(async (data) => {
    if (!user) throw new Error('Not authenticated');
    const users = loadUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...data };
      saveUsers(users);
      const u = { ...users[idx] };
      delete u.password;
      setUser(u);
      saveSession({ user: u });
    }
  }, [user]);

  const changePassword = useCallback(async ({ currentPassword, newPassword }) => {
    if (!user) throw new Error('Not authenticated');
    const users = loadUsers();
    const found = users.find((u) => u.id === user.id);
    if (!found || found.password !== currentPassword) throw new Error('Current password is incorrect.');
    found.password = newPassword;
    saveUsers(users);
  }, [user]);

  const resetPasswordRequest = useCallback(async (email) => {
    // Always show generic success (same as real flow for security)
    return { success: true };
  }, []);

  const resetPassword = useCallback(async ({ resetToken, newPassword }) => {
    // Simulate: the token encodes email (base64 in a real system)
    // For demo, accept any token that looks like 'reset:email'
    try {
      const email = atob(resetToken);
      const users = loadUsers();
      const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (found) { found.password = newPassword; saveUsers(users); }
    } catch {
      // silently succeed for demo
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        isLoadingPublicSettings,
        authChecked,
        authError,
        checkUserAuth,
        login,
        register,
        verifyOtp,
        logout,
        navigateToLogin,
        updateMe,
        changePassword,
        resetPasswordRequest,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
