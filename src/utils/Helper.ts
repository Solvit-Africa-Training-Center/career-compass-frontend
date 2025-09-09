// Helper function to get user-friendly error messages
export const getErrorMessage = (error: any, action: 'login' | 'registration'): string => {
  const status = error?.response?.status;
  const message = error?.response?.data?.message || error?.message;
  
  if (action === 'login') {
    switch (status) {
      case 400:
        return "Invalid email or password.";
      case 401:
        return "Invalid email or password. Please try again.";
      case 404:
        return "Account not found. Please check your email or create an account.";
      case 403:
        return "Your account is not verified. Please check your email.";
      case 429:
        return "Too many login attempts. Please try again later.";
      case 500:
        return "Server error. Please try again later.";
      default:
        return message?.includes('network') ? "Network error. Please check your connection." : "Login failed. Please try again.";
    }
  } else {
    switch (status) {
      case 409:
        return "An account with this email already exists. Please login instead.";
      case 400:
        return "Invalid email format or password too weak.";
      case 429:
        return "Too many registration attempts. Please try again later.";
      case 500:
        return "Server error. Please try again later.";
      default:
        return message?.includes('network') ? "Network error. Please check your connection." : "Registration failed. Please try again.";
    }
  }
};