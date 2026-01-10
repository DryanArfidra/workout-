import React, { forwardRef } from 'react';
import { EyeIcon, EyeSlashIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
  isTextarea?: boolean;
  rows?: number;
}

const InputField = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputFieldProps>(
  (props, ref) => {
    const {
      label,
      error,
      helpText,
      leftIcon,
      rightIcon,
      showPasswordToggle = false,
      isTextarea = false,
      rows = 3,
      className = '',
      type: initialType = 'text',
      ...inputProps
    } = props;

    const [showPassword, setShowPassword] = React.useState(false);
    const type = showPasswordToggle && showPassword ? 'text' : initialType;
    const hasError = !!error;
    const isDisabled = inputProps.disabled;

    const baseClasses = 'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-offset-1 transition-colors';
    const stateClasses = hasError
      ? 'border-red-500 focus:border-transparent focus:ring-red-500'
      : 'border-gray-300 focus:border-transparent focus:ring-emerald-500';
    const disabledClasses = isDisabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white';
    const combinedClasses = `${baseClasses} ${stateClasses} ${disabledClasses} ${className}`;

    const renderInput = () => {
      if (isTextarea) {
        return (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            rows={rows}
            className={`${combinedClasses} resize-none min-h-[100px]`}
            {...(inputProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        );
      }

      return (
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            type={type}
            className={`${combinedClasses} ${leftIcon ? 'pl-10' : ''} ${rightIcon || showPasswordToggle ? 'pr-10' : ''}`}
            {...inputProps}
          />
          
          {showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          )}
          
          {!showPasswordToggle && rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {inputProps.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        {renderInput()}
        
        {helpText && !hasError && (
          <div className="flex items-start text-sm text-gray-500">
            <InformationCircleIcon className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
            <span>{helpText}</span>
          </div>
        )}
        
        {hasError && (
          <div className="flex items-start text-sm text-red-600">
            <InformationCircleIcon className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';

export default InputField;

// Re-export other form components
export const SelectField: React.FC<{
  label?: string;
  error?: string;
  helpText?: string;
  options: Array<{ value: string; label: string }>;
} & React.SelectHTMLAttributes<HTMLSelectElement>> = ({
  label,
  error,
  helpText,
  options,
  className = '',
  ...selectProps
}) => {
  const hasError = !!error;
  const isDisabled = selectProps.disabled;

  const baseClasses = 'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-offset-1 transition-colors appearance-none';
  const stateClasses = hasError
    ? 'border-red-500 focus:border-transparent focus:ring-red-500'
    : 'border-gray-300 focus:border-transparent focus:ring-emerald-500';
  const disabledClasses = isDisabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white';
  const combinedClasses = `${baseClasses} ${stateClasses} ${disabledClasses} ${className}`;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {selectProps.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select className={combinedClasses} {...selectProps}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
      
      {helpText && !hasError && (
        <div className="flex items-start text-sm text-gray-500">
          <InformationCircleIcon className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
          <span>{helpText}</span>
        </div>
      )}
      
      {hasError && (
        <div className="flex items-start text-sm text-red-600">
          <InformationCircleIcon className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export const CheckboxField: React.FC<{
  label: string;
  error?: string;
  helpText?: string;
} & React.InputHTMLAttributes<HTMLInputElement>> = ({
  label,
  error,
  helpText,
  className = '',
  ...checkboxProps
}) => {
  const hasError = !!error;

  return (
    <div className="space-y-2">
      <label className="flex items-start">
        <input
          type="checkbox"
          className={`w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 mt-0.5 ${
            hasError ? 'border-red-500' : 'border-gray-300'
          } ${className}`}
          {...checkboxProps}
        />
        <span className="ml-3 text-sm text-gray-700">{label}</span>
      </label>
      
      {helpText && !hasError && (
        <div className="ml-8 flex items-start text-sm text-gray-500">
          <InformationCircleIcon className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
          <span>{helpText}</span>
        </div>
      )}
      
      {hasError && (
        <div className="ml-8 flex items-start text-sm text-red-600">
          <InformationCircleIcon className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export const RadioGroup: React.FC<{
  label?: string;
  error?: string;
  helpText?: string;
  options: Array<{ value: string; label: string }>;
  name: string;
  value: string;
  onChange: (value: string) => void;
}> = ({
  label,
  error,
  helpText,
  options,
  name,
  value,
  onChange,
}) => {
  const hasError = !!error;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option.value} className="flex items-center">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className={`w-4 h-4 text-emerald-600 focus:ring-emerald-500 ${
                hasError ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <span className="ml-3 text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
      
      {helpText && !hasError && (
        <div className="flex items-start text-sm text-gray-500">
          <InformationCircleIcon className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
          <span>{helpText}</span>
        </div>
      )}
      
      {hasError && (
        <div className="flex items-start text-sm text-red-600">
          <InformationCircleIcon className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export const DatePickerField: React.FC<{
  label?: string;
  error?: string;
  helpText?: string;
} & React.InputHTMLAttributes<HTMLInputElement>> = ({
  label,
  error,
  helpText,
  className = '',
  ...inputProps
}) => {
  const hasError = !!error;
  const isDisabled = inputProps.disabled;

  const baseClasses = 'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-offset-1 transition-colors';
  const stateClasses = hasError
    ? 'border-red-500 focus:border-transparent focus:ring-red-500'
    : 'border-gray-300 focus:border-transparent focus:ring-emerald-500';
  const disabledClasses = isDisabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white';
  const combinedClasses = `${baseClasses} ${stateClasses} ${disabledClasses} ${className}`;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {inputProps.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          type="date"
          className={combinedClasses}
          {...inputProps}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      {helpText && !hasError && (
        <div className="flex items-start text-sm text-gray-500">
          <InformationCircleIcon className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
          <span>{helpText}</span>
        </div>
      )}
      
      {hasError && (
        <div className="flex items-start text-sm text-red-600">
          <InformationCircleIcon className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export const FileUploadField: React.FC<{
  label?: string;
  error?: string;
  helpText?: string;
  accept?: string;
  onFileChange: (file: File | null) => void;
  previewUrl?: string | null;
  showPreview?: boolean;
}> = ({
  label,
  error,
  helpText,
  accept = 'image/*',
  onFileChange,
  previewUrl,
  showPreview = true,
}) => {
  const hasError = !!error;
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFileChange(file);
  };

  const handleRemoveFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onFileChange(null);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors ${
        hasError
          ? 'border-red-300 bg-red-50'
          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
      }`}>
        <div className="space-y-1 text-center">
          {showPreview && previewUrl ? (
            <div className="space-y-2">
              <img
                src={previewUrl}
                alt="Preview"
                className="mx-auto h-32 w-32 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={handleRemoveFile}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Hapus gambar
              </button>
            </div>
          ) : (
            <>
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500"
                >
                  <span>Upload file</span>
                  <input
                    ref={fileInputRef}
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept={accept}
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-1">atau drag & drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF sampai 2MB</p>
            </>
          )}
        </div>
      </div>
      
      {helpText && !hasError && (
        <div className="flex items-start text-sm text-gray-500">
          <InformationCircleIcon className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
          <span>{helpText}</span>
        </div>
      )}
      
      {hasError && (
        <div className="flex items-start text-sm text-red-600">
          <InformationCircleIcon className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

// Example usage component
export const FormExample: React.FC = () => {
  const [formData, setFormData] = React.useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: '',
    gender: 'male',
    newsletter: false,
    birthdate: '',
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800">Contoh Form Components</h2>
      
      <InputField
        label="Username"
        value={formData.username}
        onChange={(e) => handleChange('username', e.target.value)}
        placeholder="Masukkan username"
        required
        helpText="Username minimal 3 karakter"
      />
      
      <InputField
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => handleChange('email', e.target.value)}
        placeholder="email@contoh.com"
        required
        error="Email tidak valid"
      />
      
      <InputField
        label="Password"
        type="password"
        value={formData.password}
        onChange={(e) => handleChange('password', e.target.value)}
        showPasswordToggle
        required
      />
      
      <InputField
        label="Bio"
        value={formData.bio}
        onChange={(e) => handleChange('bio', e.target.value)}
        isTextarea
        rows={4}
        helpText="Maksimal 200 karakter"
      />
      
      <SelectField
        label="Jenis Kelamin"
        value={formData.gender}
        onChange={(e) => handleChange('gender', e.target.value)}
        options={[
          { value: 'male', label: 'Laki-laki' },
          { value: 'female', label: 'Perempuan' },
        ]}
      />
      
      <RadioGroup
        label="Status"
        name="status"
        value={formData.gender}
        onChange={(value) => handleChange('gender', value)}
        options={[
          { value: 'male', label: 'Aktif' },
          { value: 'female', label: 'Non-aktif' },
        ]}
      />
      
      <CheckboxField
        label="Berlangganan newsletter"
        checked={formData.newsletter}
        onChange={(e) => handleChange('newsletter', e.target.checked)}
      />
      
      <DatePickerField
        label="Tanggal Lahir"
        value={formData.birthdate}
        onChange={(e) => handleChange('birthdate', e.target.value)}
      />
    </div>
  );
};