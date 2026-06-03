import React, { createContext, useState, useEffect, useContext } from 'react';

const translations = {
  en: {
    // Navigation
    dashboard:        'Dashboard',
    groceries:        'Groceries',
    expenses:         'Expenses',
    tasks:            'Tasks',
    notifications:    'Notifications',
    household:        'Household',
    settings:         'Settings',
    logout:           'Logout',
    bills:            'Bills',
    recipes:          'Recipes',

    // Landing Page
    landingTitle:     'Smart Household Management',
    landingSubtitle:  'Manage your home smartly with real-time alerts, expense tracking, and family collaboration',
    getStarted:       'Get Started',
    learnMore:        'Learn More',
    feature1Title:    'Smart Grocery Tracking',
    feature1Desc:     'Track all your groceries with automatic low stock alerts',
    feature2Title:    'Expense Management',
    feature2Desc:     'Monitor your household budget with smart analytics',
    feature3Title:    'Family Collaboration',
    feature3Desc:     'Stay connected with all family members in real time',
    feature4Title:    'Bill Reminders',
    feature4Desc:     'Never miss a bill payment with automatic reminders',
    feature5Title:    'Recipe Based Shopping',
    feature5Desc:     'Plan your shopping based on recipes you love',
    feature6Title:    'Location Alerts',
    feature6Desc:     'Get notified when you are near a grocery store',

    // Dashboard
    welcome:          'Welcome back',
    itemsNeedRestock: 'items need restocking today',
    whatsMissing:     "What's Missing?",
    lowStock:         'Low Stock',
    empty:            'Empty',
    expiringSoon:     'Expiring Soon',
    restockAll:       'Restock All',
    totalItems:       'Total Items',
    totalExpenses:    'Total Expenses',
    pendingTasks:     'Pending Tasks',
    unpaidBills:      'Unpaid Bills',

    // Auth
    login:            'Login',
    register:         'Register',
    name:             'Name',
    email:            'Email',
    phone:            'Phone Number',
    password:         'Password',
    confirmPassword:  'Confirm Password',
    householdName:    'Household Name',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount:  "Don't have an account?",
    loginHere:        'Login here',
    registerHere:     'Register here',

    // Groceries
    addGrocery:       'Add Grocery',
    groceryName:      'Grocery Name',
    category:         'Category',
    quantity:         'Quantity',
    unit:             'Unit',
    price:            'Price',
    expiryDate:       'Expiry Date',
    purchaseDate:     'Purchase Date',
    minThreshold:     'Minimum Threshold',
    inStock:          'In Stock',
    update:           'Update',
    delete:           'Delete',
    add:              'Add',
    cancel:           'Cancel',
    save:             'Save',
    search:           'Search',

    // Categories
    vegetables:       'Vegetables',
    fruits:           'Fruits',
    dairy:            'Dairy',
    grains:           'Grains',
    snacks:           'Snacks',
    cleaning:         'Cleaning',
    other:            'Other',

    // Expenses
    addExpense:       'Add Expense',
    expenseTitle:     'Expense Title',
    amount:           'Amount',
    date:             'Date',
    notes:            'Notes',
    totalSpent:       'Total Spent',
    monthlyBudget:    'Monthly Budget',
    remaining:        'Remaining',
    budgetExceeded:   'Budget Exceeded',

    // Tasks
    addTask:          'Add Task',
    taskTitle:        'Task Title',
    assignedTo:       'Assigned To',
    deadline:         'Deadline',
    priority:         'Priority',
    status:           'Status',
    pending:          'Pending',
    completed:        'Completed',
    high:             'High',
    medium:           'Medium',
    low:              'Low',
    markComplete:     'Mark Complete',

    // Bills
    addBill:          'Add Bill',
    billName:         'Bill Name',
    dueDate:          'Due Date',
    billAmount:       'Bill Amount',
    paid:             'Paid',
    unpaid:           'Unpaid',
    overdue:          'Overdue',
    markAsPaid:       'Mark as Paid',
    electricity:      'Electricity',
    water:            'Water',
    gas:              'Gas',
    internet:         'Internet',
    rent:             'Rent',

    // Recipes
    searchRecipe:     'Search Recipe',
    ingredients:      'Ingredients',
    addToShoppingList: 'Add to Shopping List',
    addCustomRecipe:  'Add Custom Recipe',
    customRecipes:    'Custom Recipes',

    // Household
    members:          'Members',
    inviteCode:       'Invite Code',
    addGuest:         'Add Guest',
    removeGuest:      'Remove Guest',
    joinHousehold:    'Join Household',
    admin:            'Admin',
    member:           'Member',
    guest:            'Guest',
    guestExpires:     'Guest Expires',
    daysAccess:       'Days Access',

    // Notifications
    markAllRead:      'Mark All Read',
    noNotifications:  'No notifications yet',

    // Settings
    language:         'Language',
    theme:            'Theme',
    darkMode:         'Dark Mode',
    lightMode:        'Light Mode',
    saveSettings:     'Save Settings',

    // Emergency
    emergency:        'Emergency',
    emergencyCenter:  'Emergency Center',
    triggerAlert:     'Trigger Alert',
    resolveEmergency: 'Resolve Emergency',
    emergencyHistory: 'Emergency History',
    noEmergencies:    'No emergencies recorded. Stay safe!',
    fire:             'Fire',
    medical:          'Medical',
    gas:              'Gas Leak',
    power:            'Power Cut',
    flood:            'Flood',
    active:           'Active',
    resolved:         'Resolved',

    // Chat
    chat:             'Chat',
    typeMessage:      'Type a message...',
    send:             'Send',
    noMessages:       'No messages yet. Start chatting!',
    householdChat:    'Household Chat',
    english:          'English',
    tamil:            'தமிழ்',

    // Alerts
    lowStockAlert:    'is running low!',
    emptyAlert:       'is empty!',
    expiryAlert:      'is expiring soon!',
    budgetAlert:      'Monthly budget exceeded!',
    nearbyStore:      'You are near a store!',
    viewShoppingList: 'View Shopping List',
  },

  ta: {
    // Navigation
    dashboard:        'முகப்பு',
    groceries:        'மளிகை பொருட்கள்',
    expenses:         'செலவுகள்',
    tasks:            'பணிகள்',
    notifications:    'அறிவிப்புகள்',
    household:        'குடும்பம்',
    settings:         'அமைப்புகள்',
    logout:           'வெளியேறு',
    bills:            'கட்டணங்கள்',
    recipes:          'சமையல் குறிப்புகள்',

    // Landing Page
    landingTitle:     'அறிவார்ந்த வீட்டு நிர்வாகம்',
    landingSubtitle:  'நிகழ்நேர எச்சரிக்கைகள், செலவு கண்காணிப்பு மற்றும் குடும்ப ஒத்துழைப்புடன் உங்கள் வீட்டை அறிவார்ந்த முறையில் நிர்வகிக்கவும்',
    getStarted:       'தொடங்குங்கள்',
    learnMore:        'மேலும் அறிக',
    feature1Title:    'அறிவார்ந்த மளிகை கண்காணிப்பு',
    feature1Desc:     'தானியங்கி குறைந்த இருப்பு எச்சரிக்கைகளுடன் உங்கள் மளிகை பொருட்களை கண்காணிக்கவும்',
    feature2Title:    'செலவு நிர்வாகம்',
    feature2Desc:     'அறிவார்ந்த பகுப்பாய்வுடன் உங்கள் வீட்டு பட்ஜெட்டை கண்காணிக்கவும்',
    feature3Title:    'குடும்ப ஒத்துழைப்பு',
    feature3Desc:     'நிகழ்நேரத்தில் அனைத்து குடும்ப உறுப்பினர்களுடன் இணைந்திருங்கள்',
    feature4Title:    'கட்டண நினைவூட்டல்கள்',
    feature4Desc:     'தானியங்கி நினைவூட்டல்களுடன் எந்த கட்டண தேதியையும் தவறவிடாதீர்கள்',
    feature5Title:    'சமையல் குறிப்பு அடிப்படையிலான கொள்முதல்',
    feature5Desc:     'நீங்கள் விரும்பும் சமையல் குறிப்புகளின் அடிப்படையில் கொள்முதலை திட்டமிடுங்கள்',
    feature6Title:    'இடம் சார்ந்த எச்சரிக்கைகள்',
    feature6Desc:     'மளிகை கடையின் அருகில் இருக்கும்போது அறிவிப்பு பெறுங்கள்',

    // Dashboard
    welcome:          'மீண்டும் வரவேற்கிறோம்',
    itemsNeedRestock: 'பொருட்கள் இன்று நிரப்ப வேண்டும்',
    whatsMissing:     'என்ன தேவை?',
    lowStock:         'குறைந்த இருப்பு',
    empty:            'காலி',
    expiringSoon:     'விரைவில் காலாவதியாகும்',
    restockAll:       'அனைத்தையும் நிரப்பு',
    totalItems:       'மொத்த பொருட்கள்',
    totalExpenses:    'மொத்த செலவுகள்',
    pendingTasks:     'நிலுவையில் உள்ள பணிகள்',
    unpaidBills:      'செலுத்தப்படாத கட்டணங்கள்',

    // Auth
    login:            'உள்நுழை',
    register:         'பதிவு செய்யவும்',
    name:             'பெயர்',
    email:            'மின்னஞ்சல்',
    phone:            'தொலைபேசி எண்',
    password:         'கடவுச்சொல்',
    confirmPassword:  'கடவுச்சொல்லை உறுதிப்படுத்தவும்',
    householdName:    'குடும்பத்தின் பெயர்',
    alreadyHaveAccount: 'ஏற்கனவே கணக்கு உள்ளதா?',
    dontHaveAccount:  'கணக்கு இல்லையா?',
    loginHere:        'இங்கே உள்நுழையவும்',
    registerHere:     'இங்கே பதிவு செய்யவும்',

    // Groceries
    addGrocery:       'மளிகை சேர்க்கவும்',
    groceryName:      'மளிகை பெயர்',
    category:         'வகை',
    quantity:         'அளவு',
    unit:             'அலகு',
    price:            'விலை',
    expiryDate:       'காலாவதி தேதி',
    purchaseDate:     'வாங்கிய தேதி',
    minThreshold:     'குறைந்தபட்ச அளவு',
    inStock:          'இருப்பில் உள்ளது',
    update:           'புதுப்பிக்கவும்',
    delete:           'நீக்கவும்',
    add:              'சேர்க்கவும்',
    cancel:           'ரத்து செய்',
    save:             'சேமிக்கவும்',
    search:           'தேடுங்கள்',

    // Categories
    vegetables:       'காய்கறிகள்',
    fruits:           'பழங்கள்',
    dairy:            'பால் பொருட்கள்',
    grains:           'தானியங்கள்',
    snacks:           'சிற்றுண்டி',
    cleaning:         'சுத்தம்',
    other:            'மற்றவை',

    // Expenses
    addExpense:       'செலவு சேர்க்கவும்',
    expenseTitle:     'செலவு தலைப்பு',
    amount:           'தொகை',
    date:             'தேதி',
    notes:            'குறிப்புகள்',
    totalSpent:       'மொத்த செலவு',
    monthlyBudget:    'மாதாந்திர பட்ஜெட்',
    remaining:        'மீதமுள்ளது',
    budgetExceeded:   'பட்ஜெட் தாண்டியது',

    // Tasks
    addTask:          'பணி சேர்க்கவும்',
    taskTitle:        'பணி தலைப்பு',
    assignedTo:       'யாருக்கு ஒதுக்கப்பட்டது',
    deadline:         'கடைசி தேதி',
    priority:         'முன்னுரிமை',
    status:           'நிலை',
    pending:          'நிலுவையில் உள்ளது',
    completed:        'முடிந்தது',
    high:             'அதிகம்',
    medium:           'நடுத்தரம்',
    low:              'குறைவு',
    markComplete:     'முடிந்தது என்று குறி',

    // Bills
    addBill:          'கட்டணம் சேர்க்கவும்',
    billName:         'கட்டண பெயர்',
    dueDate:          'நிலுவை தேதி',
    billAmount:       'கட்டண தொகை',
    paid:             'செலுத்தப்பட்டது',
    unpaid:           'செலுத்தப்படவில்லை',
    overdue:          'தாமதமானது',
    markAsPaid:       'செலுத்தப்பட்டது என்று குறி',
    electricity:      'மின்சாரம்',
    water:            'தண்ணீர்',
    gas:              'எரிவாயு',
    internet:         'இணையம்',
    rent:             'வாடகை',

    // Recipes
    searchRecipe:     'சமையல் குறிப்பு தேடவும்',
    ingredients:      'பொருட்கள்',
    addToShoppingList: 'கொள்முதல் பட்டியலில் சேர்க்கவும்',
    addCustomRecipe:  'தனிப்பயன் சமையல் குறிப்பு சேர்க்கவும்',
    customRecipes:    'தனிப்பயன் சமையல் குறிப்புகள்',

    // Household
    members:          'உறுப்பினர்கள்',
    inviteCode:       'அழைப்பு குறியீடு',
    addGuest:         'விருந்தினர் சேர்க்கவும்',
    removeGuest:      'விருந்தினரை நீக்கவும்',
    joinHousehold:    'குடும்பத்தில் சேரவும்',
    admin:            'நிர்வாகி',
    member:           'உறுப்பினர்',
    guest:            'விருந்தினர்',
    guestExpires:     'விருந்தினர் காலாவதி',
    daysAccess:       'நாட்கள் அணுகல்',

    // Notifications
    markAllRead:      'அனைத்தையும் படித்ததாக குறி',
    noNotifications:  'இன்னும் அறிவிப்புகள் இல்லை',

    // Settings
    language:         'மொழி',
    theme:            'தீம்',
    darkMode:         'இருண்ட பயன்முறை',
    lightMode:        'ஒளி பயன்முறை',
    saveSettings:     'அமைப்புகளை சேமிக்கவும்',

    // Emergency
    emergency:        'அவசரநிலை',
    emergencyCenter:  'அவசரநிலை மையம்',
    triggerAlert:     'எச்சரிக்கை அனுப்பு',
    resolveEmergency: 'அவசரநிலை தீர்க்கவும்',
    emergencyHistory: 'அவசரநிலை வரலாறு',
    noEmergencies:    'அவசரநிலைகள் இல்லை. பாதுகாப்பாக இருங்கள்!',
    fire:             'தீ',
    medical:          'மருத்துவம்',
    gas:              'எரிவாயு கசிவு',
    power:            'மின்சாரம் துண்டிப்பு',
    flood:            'வெள்ளம்',
    active:           'செயலில்',
    resolved:         'தீர்க்கப்பட்டது',

    // Chat
    chat:             'அரட்டை',
    typeMessage:      'செய்தி தட்டச்சு செய்யவும்...',
    send:             'அனுப்பு',
    noMessages:       'இன்னும் செய்திகள் இல்லை. பேசத் தொடங்குங்கள்!',
    householdChat:    'குடும்ப அரட்டை',
    english:          'English',
    tamil:            'தமிழ்',

    // Alerts
    lowStockAlert:    'குறைவாக உள்ளது!',
    emptyAlert:       'காலியாக உள்ளது!',
    expiryAlert:      'விரைவில் காலாவதியாகும்!',
    budgetAlert:      'மாதாந்திர பட்ஜெட் தாண்டியது!',
    nearbyStore:      'நீங்கள் ஒரு கடையின் அருகில் உள்ளீர்கள்!',
    viewShoppingList: 'கொள்முதல் பட்டியலை பார்க்கவும்',
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(
    localStorage.getItem('language') || 'en'
  );

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ta' : 'en');
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext;