# 🚀 Forms Migration Guide

## 📋 **Overview**

This guide shows how to migrate all existing forms to use the new `useSharedForm` hook for consistent behavior, better data flow, and improved maintainability.

---

## 🎯 **Migration Steps**

### **Step 1: Import the Shared Hook**
```javascript
// ✅ NEW: Import shared form hook
import { useSharedForm, FORM_MODES, AUTO_SAVE_CONFIG, createValidator, ValidationPatterns } from '@/hooks/useSharedForm';
```

### **Step 2: Replace Local State Management**
```javascript
// ❌ OLD: Local state management
const [formData, setFormData] = useState({});
const [isSaving, setIsSaving] = useState(false);
const [errors, setErrors] = useState({});

// ✅ NEW: Shared form hook
const form = useSharedForm({
  initialData,
  onDataChange: (data, isDirty) => setFormData(data), // Optional parent sync
  onSave: async (data, options) => {
    // Your save logic here
    return await saveToDatabase(data);
  },
  onValidate: createValidator({
    name: [ValidationPatterns.required],
    email: [ValidationPatterns.required, ValidationPatterns.email],
  }),
  defaultState: {
    name: '',
    email: '',
    status: 'active',
  },
  mode: FORM_MODES.EDIT,
  autoSave: AUTO_SAVE_CONFIG.ON_CHANGE,
  debug: true, // Enable for development
});
```

### **Step 3: Update Field Handlers**
```javascript
// ❌ OLD: Manual field updates
const handleInputChange = (field, value) => {
  setFormData(prev => ({ ...prev, [field]: value }));
};

// ✅ NEW: Shared form handlers
const handleInputChange = (field, value) => {
  form.handleFieldChange(field, value); // Includes auto-save
};

// Or for multiple fields:
const handleMultipleChanges = (updates) => {
  form.handleFieldsChange(updates);
};
```

### **Step 4: Update Array Field Handlers**
```javascript
// ❌ OLD: Manual array management
const addTag = (tag) => {
  setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
};

const removeTag = (index) => {
  setFormData(prev => ({ ...prev, tags: prev.tags.filter((_, i) => i !== index) }));
};

// ✅ NEW: Shared form array handlers
const addTag = (tag) => {
  form.addArrayItem('tags', tag);
};

const removeTag = (index) => {
  form.removeArrayItem('tags', index);
};

const toggleTag = (tag) => {
  form.toggleArrayItem('tags', tag); // Add if not present, remove if present
};
```

### **Step 5: Update Save Logic**
```javascript
// ❌ OLD: Manual save handling
const handleSave = async () => {
  setIsSaving(true);
  try {
    await saveToDatabase(formData);
    setIsSaving(false);
  } catch (error) {
    setIsSaving(false);
  }
};

// ✅ NEW: Shared form save
const handleSave = async () => {
  try {
    await form.handleSave(); // Handles validation, errors, loading state
    // Success handled automatically
  } catch (error) {
    // Error handled automatically, form.errors populated
  }
};
```

---

## 🔄 **Complete Migration Examples**

### **Example 1: InlineBusinessForm Migration**

#### **BEFORE (Current Implementation)**
```javascript
const InlineBusinessForm = ({ formData, setFormData, onSave, saving = false }) => {
  const [localFormData, setLocalFormData] = useState(formData || {});
  const [expandedSections, setExpandedSections] = useState(new Set(["core"]));

  useEffect(() => {
    setLocalFormData(formData || {});
  }, [formData]);

  const updateFormData = (newData) => {
    setLocalFormData(newData);
    setFormData(newData);
  };

  const handleInputChange = (field, value) => {
    const newData = { ...localFormData, [field]: value };
    updateFormData(newData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(localFormData);
  };
};
```

#### **AFTER (With Shared Hook)**
```javascript
const InlineBusinessForm = ({ formData, setFormData, onSave, saving = false }) => {
  const form = useSharedForm({
    initialData: formData,
    onDataChange: (data, isDirty) => setFormData(data),
    onSave: async (data, options) => {
      return await onSave(data);
    },
    defaultState: {
      name: '',
      business_handle: '',
      description: '',
      industry: '',
      country: '',
      city: '',
    },
    mode: formData?.id ? FORM_MODES.EDIT : FORM_MODES.CREATE,
    autoSave: AUTO_SAVE_CONFIG.ON_SECTION_TOGGLE,
    debug: process.env.NODE_ENV === 'development',
  });

  // Section management (local state only)
  const [expandedSections, setExpandedSections] = useState(new Set(["core"]));
  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionKey)) {
        next.delete(sectionKey);
        // Trigger auto-save when section closes
        if (form.autoSave === AUTO_SAVE_CONFIG.ON_SECTION_TOGGLE) {
          form.triggerAutoSave();
        }
      } else {
        next.add(sectionKey);
      }
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    form.handleSave();
  };
};
```

### **Example 2: FounderInsightsForm Migration**

#### **BEFORE (Current Implementation)**
```javascript
const FounderInsightsForm = ({ businessId, onSubmit, isLoading, initialData = null }) => {
  const [form, setForm] = useState(() => buildInitialFormState(initialData));
  const [step, setStep] = useState(1);

  useEffect(() => {
    setForm(buildInitialFormState(initialData));
  }, [initialData]);

  const addArrayItem = (field, item) => {
    setForm(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), item]
    }));
  };

  const removeArrayItem = (field, index) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };
};
```

#### **AFTER (With Shared Hook)**
```javascript
const FounderInsightsForm = ({ businessId, onSubmit, isLoading, initialData = null }) => {
  const form = useSharedForm({
    initialData,
    onSave: async (data, options) => {
      return await onSubmit({ ...data, business_id: businessId });
    },
    defaultState: {
      // Founder Background
      gender: '',
      age_range: '',
      years_entrepreneurial: '',
      businesses_founded: '',
      founder_role: '',
      founder_motivation_array: [],
      founder_story: '',
      
      // Business Reality
      business_operating_status: '',
      business_age: '',
      industry: '',
      team_size_band: '',
      revenue_band: '',
      business_registered: false,
      employs_anyone: false,
      employs_family_community: false,
      sales_channels: [],
    },
    mode: FORM_MODES.EDIT,
    autoSave: AUTO_SAVE_CONFIG.ON_BLUR,
    debug: true,
  });

  // Step management (local state only)
  const [step, setStep] = useState(1);

  // Array handlers are now provided by the hook
  // form.addArrayItem('founder_motivation_array', motivation);
  // form.removeArrayItem('founder_motivation_array', index);
  // form.toggleArrayItem('founder_motivation_array', motivation);
};
```

### **Example 3: ClaimDetailsForm Migration**

#### **BEFORE (Current Implementation)**
```javascript
const ClaimDetailsForm = ({ business, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    contact_email: '',
    contact_phone: '',
    role: 'owner',
    message: '',
    proof_url: '',
  });

  const set = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.contact_email) {
      alert('Please provide a business email address');
      return;
    }
    onSubmit(formData);
  };
};
```

#### **AFTER (With Shared Hook)**
```javascript
const ClaimDetailsForm = ({ business, onSubmit, isLoading }) => {
  const form = useSharedForm({
    onSave: async (data, options) => {
      return await onSubmit({ ...data, business_id: business.id });
    },
    onValidate: createValidator({
      contact_email: [ValidationPatterns.required, ValidationPatterns.email],
    }),
    defaultState: {
      contact_email: '',
      contact_phone: '',
      role: 'owner',
      message: '',
      proof_url: '',
    },
    mode: FORM_MODES.CREATE,
    autoSave: AUTO_SAVE_CONFIG.DISABLED, // Manual save only
    debug: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    form.handleSave(); // Validation handled automatically
  };
};
```

---

## 🎯 **Benefits of Migration**

### **✅ Consistent Behavior**
- All forms behave the same way
- Predictable data flow
- Unified error handling

### **✅ Better User Experience**
- Auto-save functionality
- Data persistence during navigation
- Better error feedback

### **✅ Developer Experience**
- Less boilerplate code
- Built-in debugging
- Type safety (if using TypeScript)
- Easier testing

### **✅ Maintainability**
- Single source of truth for form logic
- Centralized bug fixes
- Easier to add new features

---

## 📋 **Migration Checklist**

### **Phase 1: Critical Forms**
- [ ] **InlineBusinessForm** - Already optimized, add shared hook
- [ ] **DetailedBusinessForm** - High priority (admin functionality)
- [ ] **FounderInsightsForm** - High priority (user data)

### **Phase 2: Enhancement Forms**
- [ ] **BusinessInsightsAccordion** - Add parent sync
- [ ] **FounderInsightsAccordion** - Add parent sync
- [ ] **ClaimDetailsForm** - Add data persistence

### **Phase 3: Testing & Polish**
- [ ] **All forms** - Test auto-save functionality
- [ ] **All forms** - Test error handling
- [ ] **All forms** - Test parent-child sync
- [ ] **All forms** - Remove debug logging in production

---

## 🚀 **Advanced Features**

### **Custom Validation**
```javascript
const customValidator = createValidator({
  password: [
    ValidationPatterns.required,
    ValidationPatterns.minLength(8),
    (value) => {
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
        return { type: 'error', message: 'Password must contain uppercase, lowercase, and number' };
      }
      return null;
    }
  ],
  confirmPassword: [
    ValidationPatterns.required,
    (value, formData) => {
      if (value !== formData.password) {
        return 'Passwords must match';
      }
      return null;
    }
  ],
});
```

### **Conditional Auto-Save**
```javascript
const form = useSharedForm({
  autoSave: isPremiumUser ? AUTO_SAVE_CONFIG.ON_CHANGE : AUTO_SAVE_CONFIG.DISABLED,
  // ... other config
});
```

### **Custom Field Transformers**
```javascript
const form = useSharedForm({
  // Transform data before saving
  onSave: async (data, options) => {
    const transformedData = {
      ...data,
      social_links: transformSocialLinksToDB(data.social_links),
      metadata: {
        last_updated: new Date().toISOString(),
        updated_by: user.id,
      },
    };
    return await saveToDatabase(transformedData);
  },
});
```

---

## 🎯 **Conclusion**

Migrating to the shared form hook provides:

1. **🔄 Consistent Data Flow** - All forms work the same way
2. **🚀 Better Performance** - Optimized re-renders and auto-save
3. **🛠️ Easier Maintenance** - Single source of truth
4. **🐛 Better Debugging** - Built-in logging and error tracking
5. **⚡ Faster Development** - Less boilerplate, more features

Start with the critical forms and gradually migrate all forms to achieve consistency across the application! 🎉
