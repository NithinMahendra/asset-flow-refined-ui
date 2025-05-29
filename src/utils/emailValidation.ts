
// Email validation utility
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  // Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  // Check for common invalid domains that Supabase rejects
  const invalidDomains = ['.co.in', '.tk', '.ml', '.ga', '.cf'];
  const domain = email.toLowerCase();
  
  for (const invalidDomain of invalidDomains) {
    if (domain.includes(invalidDomain)) {
      return { 
        isValid: false, 
        error: `Email domains ending with "${invalidDomain}" are not supported. Please use a standard email provider like Gmail, Outlook, or Yahoo.` 
      };
    }
  }
  
  // Check for common typos in popular domains
  const commonTypos = {
    'gmial.com': 'gmail.com',
    'gmai.com': 'gmail.com',
    'gmail.co': 'gmail.com',
    'hotmial.com': 'hotmail.com',
    'outlok.com': 'outlook.com'
  };
  
  const emailDomain = email.split('@')[1]?.toLowerCase();
  if (emailDomain && commonTypos[emailDomain]) {
    return { 
      isValid: false, 
      error: `Did you mean "${email.split('@')[0]}@${commonTypos[emailDomain]}"?` 
    };
  }
  
  return { isValid: true };
};

export const parseSupabaseError = (error: any): string => {
  if (!error?.message) return 'An unexpected error occurred';
  
  const message = error.message.toLowerCase();
  
  if (message.includes('email address') && message.includes('invalid')) {
    return 'This email address is not supported. Please use a standard email provider like Gmail, Outlook, or Yahoo.';
  }
  
  if (message.includes('user already registered')) {
    return 'An account with this email already exists. Please try logging in instead.';
  }
  
  if (message.includes('password')) {
    return 'Password must be at least 6 characters long.';
  }
  
  if (message.includes('database error')) {
    return 'There was a system error creating your account. Please try again in a moment.';
  }
  
  if (message.includes('network') || message.includes('timeout')) {
    return 'Network error. Please check your connection and try again.';
  }
  
  return error.message;
};
