import type { Meta, StoryObj } from '@storybook/vue3';
import {
  NCommand,
  NCommandEmpty,
  NCommandGroup,
  NCommandInput,
  NCommandItem,
  NCommandList,
  NCommandSeparator,
} from './';
import {
  Calendar,
  Smile,
  Calculator,
  User,
  CreditCard,
  Settings,
} from 'lucide-vue-next';

/**
 * Command menu component for searching and executing actions.
 */
const meta: Meta<typeof NCommand> = {
  title: 'Components/UI/NCommand',
  component: NCommand,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NCommand>;

export const Default: Story = {
  render: (args) => ({
    components: {
      NCommand,
      NCommandEmpty,
      NCommandGroup,
      NCommandInput,
      NCommandItem,
      NCommandList,
      NCommandSeparator,
      Calendar,
      Smile,
      Calculator,
      User,
      CreditCard,
      Settings,
    },
    setup() {
      return { args };
    },
    template: `
      <NCommand class="rounded-lg border shadow-md max-w-[450px]">
        <NCommandInput placeholder="Type a command or search..." />
        <NCommandList>
          <NCommandEmpty>No results found.</NCommandEmpty>
          <NCommandGroup heading="Suggestions">
            <NCommandItem value="calendar">
              <Calendar class="mr-2 h-4 w-4" />
              <span>Calendar</span>
            </NCommandItem>
            <NCommandItem value="search-emoji">
              <Smile class="mr-2 h-4 w-4" />
              <span>Search Emoji</span>
            </NCommandItem>
            <NCommandItem value="calculator">
              <Calculator class="mr-2 h-4 w-4" />
              <span>Calculator</span>
            </NCommandItem>
          </NCommandGroup>
          <NCommandSeparator />
          <NCommandGroup heading="Settings">
            <NCommandItem value="profile">
              <User class="mr-2 h-4 w-4" />
              <span>Profile</span>
              <kbd class="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span class="text-xs">⌘</span>P
              </kbd>
            </NCommandItem>
            <NCommandItem value="billing">
              <CreditCard class="mr-2 h-4 w-4" />
              <span>Billing</span>
              <kbd class="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span class="text-xs">⌘</span>B
              </kbd>
            </NCommandItem>
            <NCommandItem value="settings">
              <Settings class="mr-2 h-4 w-4" />
              <span>Settings</span>
              <kbd class="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span class="text-xs">⌘</span>S
              </kbd>
            </NCommandItem>
          </NCommandGroup>
        </NCommandList>
      </NCommand>
    `,
  }),
};
