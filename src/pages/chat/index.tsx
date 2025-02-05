// import { CommandMenu } from '@/components/search/command-menu';
import { memo } from 'react';
import {
  ConversationList,
  ConversationHeader,
  ConversationDetails,
  ConversationInput,
  ConversationMessages
} from './components/conversation';

export const ChatPage = memo(() => {
  return (
    <div className="fixed inset-0 bg-background pl-[56px] flex">
      <ConversationList />

      <div className="flex-1 flex flex-col min-w-0">
        <ConversationHeader />

        <div className="flex-1 overflow-y-auto min-h-0">
          <ConversationMessages />
        </div>

        <ConversationInput />
      </div>

      <ConversationDetails />

      {/* <CommandMenu
        isOpen={ui.isSearchOpen}
        onClose={toggleSearch}
      /> */}
    </div>
  );
});

ChatPage.displayName = 'ChatPage';