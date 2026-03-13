import { BUTTON_STYLES, CARD_STYLES } from "@/constants/portalUI";
import { 
  Building2, 
  Users, 
  CheckCircle,
  Search,
  Plus,
} from "lucide-react";
import { getEmptyStateConfig } from "@/utils/dataTransformers";

const ICON_MAP = {
  Building2,
  Users,
  CheckCircle,
};

export default function EmptyState({ 
  type, 
  onboardingStatus, 
  onAction 
}) {
  const config = getEmptyStateConfig(type, onboardingStatus);
  
  if (!config) return null;

  const Icon = ICON_MAP[config.icon] || Building2;

  const renderActionButton = (action, index) => {
    const ActionIcon = action.icon === "Search" ? Search : Plus;
    const isDisabled = action.variant === "disabled";
    const buttonStyle = action.variant === "primary" 
      ? BUTTON_STYLES.primary 
      : action.variant === "secondary"
      ? BUTTON_STYLES.secondary
      : BUTTON_STYLES.disabled;

    const buttonProps = {
      key: action.key || index,
      className: buttonStyle,
      onClick: isDisabled ? undefined : () => onAction(action.key),
      disabled: isDisabled,
    };

    if (isDisabled) {
      return (
        <button {...buttonProps}>
          <ActionIcon className="w-4 h-4" />
          {action.label}
        </button>
      );
    }

    return (
      <button {...buttonProps}>
        <ActionIcon className="w-4 h-4" />
        {action.label}
      </button>
    );
  };

  return (
    <div className={CARD_STYLES.empty}>
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-200 bg-white">
        <Icon className="w-7 h-7 text-gray-400" />
      </div>

      <h3 className="text-lg font-bold text-[#0a1628]">
        {config.title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
        {config.description}
      </p>

      {config.actions.length > 0 && (
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {config.actions.map(renderActionButton)}
        </div>
      )}
    </div>
  );
}
