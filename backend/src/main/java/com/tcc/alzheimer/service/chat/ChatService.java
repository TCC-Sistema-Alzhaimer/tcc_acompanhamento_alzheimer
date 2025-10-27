package com.tcc.alzheimer.service.chat;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tcc.alzheimer.dto.chat.ChatCreateRequestDTO;
import com.tcc.alzheimer.dto.chat.ChatMessageCreateRequestDTO;
import com.tcc.alzheimer.dto.chat.ChatMessageResponseDTO;
import com.tcc.alzheimer.dto.chat.ChatParticipantDTO;
import com.tcc.alzheimer.dto.chat.ChatParticipantsAddRequestDTO;
import com.tcc.alzheimer.dto.chat.ChatResponseDTO;
import com.tcc.alzheimer.exception.AccessDeniedException;
import com.tcc.alzheimer.exception.ResourceConflictException;
import com.tcc.alzheimer.exception.ResourceNotFoundException;
import com.tcc.alzheimer.model.chat.Chat;
import com.tcc.alzheimer.model.chat.ChatMessage;
import com.tcc.alzheimer.model.chat.ChatUser;
import com.tcc.alzheimer.model.roles.User;
import com.tcc.alzheimer.repository.chat.ChatMessageRepository;
import com.tcc.alzheimer.repository.chat.ChatRepository;
import com.tcc.alzheimer.repository.chat.ChatUserRepository;
import com.tcc.alzheimer.repository.roles.UserRepository;
import com.tcc.alzheimer.service.auth.AuthService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final ChatUserRepository chatUserRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final AuthService authService;

    @Transactional
    public ChatResponseDTO createChat(ChatCreateRequestDTO request) {
        User creator = authService.getCurrentUser();
        String chatName = request.getName().trim();

        Chat chat = chatRepository.save(Chat.builder()
                .name(chatName)
                .build());

        // garante que quem criou esteja sempre no chat
        chat.addParticipant(ChatUser.builder()
                .chat(chat)
                .user(creator)
                .build());

        Set<Long> participantIds = new LinkedHashSet<>();
        if (request.getParticipantIds() != null) {
            request.getParticipantIds().stream()
                    .filter(Objects::nonNull)
                    .filter(id -> !Objects.equals(id, creator.getId()))
                    .forEach(participantIds::add);
        }

        participantIds.stream()
                .map(this::findActiveUserOrThrow)
                .forEach(user -> {
                    ChatUser chatUser = ChatUser.builder()
                            .chat(chat)
                            .user(user)
                            .build();
                    chat.addParticipant(chatUser);
                });

        chatRepository.save(chat);

        ChatUser creatorMembership = chat.getParticipants().stream()
                .filter(participant -> participant.getUser() != null
                        && Objects.equals(participant.getUser().getId(), creator.getId()))
                .findFirst()
                .orElse(null);

        return toChatResponseDTO(chat, creator, creatorMembership, true);
    }

    @Transactional
    public ChatResponseDTO addParticipants(Long chatId, ChatParticipantsAddRequestDTO request) {
        User currentUser = authService.getCurrentUser();
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat não encontrado com id: " + chatId));

        ChatUser currentMembership = getMembershipOrThrow(chatId, currentUser.getId());

        Set<Long> newParticipantIds = new LinkedHashSet<>(request.getParticipantIds());
        newParticipantIds.removeIf(Objects::isNull);

        if (newParticipantIds.isEmpty()) {
            throw new ResourceConflictException("Informe ao menos um participante válido para adicionar");
        }

        List<User> usersToAdd = new ArrayList<>();
        for (Long userId : newParticipantIds) {
            if (chatUserRepository.existsByChatIdAndUserId(chatId, userId)) {
                throw new ResourceConflictException("Usuário já participa do chat: " + userId);
            }
            usersToAdd.add(findActiveUserOrThrow(userId));
        }

        usersToAdd.forEach(user -> {
            ChatUser chatUser = ChatUser.builder()
                    .chat(chat)
                    .user(user)
                    .build();
            chat.addParticipant(chatUser);
        });

        chatRepository.save(chat);

        return toChatResponseDTO(chat, currentUser, currentMembership, true);
    }

    @Transactional(readOnly = true)
    public List<ChatResponseDTO> listMyChats() {
        User currentUser = authService.getCurrentUser();
        List<ChatUser> memberships = chatUserRepository.findByUserId(currentUser.getId());
        Set<Long> seenChatIds = new LinkedHashSet<>();
        List<ChatResponseDTO> responses = new ArrayList<>();

        for (ChatUser membership : memberships) {
            Chat chat = membership.getChat();
            if (chat != null && seenChatIds.add(chat.getId())) {
                responses.add(toChatResponseDTO(chat, currentUser, membership, true));
            }
        }

        return responses;
    }

    @Transactional(readOnly = true)
    public Page<ChatMessageResponseDTO> listMessages(Long chatId, int page, int size) {
        User currentUser = authService.getCurrentUser();
        getMembershipOrThrow(chatId, currentUser.getId());

        chatRepository.findById(chatId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat não encontrado com id: " + chatId));

        if (size <= 0) {
            throw new ResourceConflictException("O tamanho da página deve ser maior que zero");
        }
        if (page < 0) {
            throw new ResourceConflictException("O índice da página não pode ser negativo");
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "sentAt"));
        return chatMessageRepository.findByChatIdOrderBySentAtAsc(chatId, pageable)
                .map(this::toChatMessageResponseDTO);
    }

    @Transactional(readOnly = true)
    public List<ChatMessageResponseDTO> listMessagesAfter(Long chatId, Long lastMessageId) {
        User currentUser = authService.getCurrentUser();
        getMembershipOrThrow(chatId, currentUser.getId());

        if (lastMessageId == null) {
            throw new ResourceConflictException("Informe o identificador da última mensagem conhecida");
        }

        chatRepository.findById(chatId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat não encontrado com id: " + chatId));

        return chatMessageRepository.findByChatIdAndIdGreaterThanOrderBySentAtAsc(chatId, lastMessageId).stream()
                .map(this::toChatMessageResponseDTO)
                .toList();
    }

    @Transactional
    public void updateLastReadMessage(Long chatId, Long messageId) {
        User currentUser = authService.getCurrentUser();
        ChatUser membership = getMembershipOrThrow(chatId, currentUser.getId());

        if (messageId == null) {
            throw new ResourceConflictException("Informe a mensagem que foi lida");
        }

        if (messageId <= 0) {
            throw new ResourceConflictException("O identificador da mensagem deve ser positivo");
        }

        ChatMessage message = chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Mensagem não encontrada: " + messageId));

        if (!chatId.equals(message.getChat().getId())) {
            throw new ResourceConflictException("A mensagem informada não pertence a este chat");
        }

        if (membership.getLastReadMessageId() != null && membership.getLastReadMessageId() >= messageId) {
            return;
        }

        membership.setLastReadMessageId(messageId);
        chatUserRepository.save(membership);
    }

    @Transactional(readOnly = true)
    public ChatResponseDTO getChat(Long chatId) {
        User currentUser = authService.getCurrentUser();
        ChatUser membership = getMembershipOrThrow(chatId, currentUser.getId());

        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat não encontrado com id: " + chatId));

        return toChatResponseDTO(chat, currentUser, membership, false);
    }

    @Transactional
    public ChatMessageResponseDTO sendMessage(Long chatId, ChatMessageCreateRequestDTO request) {
        User sender = authService.getCurrentUser();
        getMembershipOrThrow(chatId, sender.getId());

        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat não encontrado com id: " + chatId));

        String messageBody = request.getMessage() != null ? request.getMessage().trim() : null;
        if (messageBody == null || messageBody.isEmpty()) {
            throw new ResourceConflictException("A mensagem não pode ser vazia");
        }

        String messageType = request.getType();
        if (messageType == null || messageType.isBlank()) {
            messageType = "TEXT";
        }

        ChatMessage message = ChatMessage.builder()
                .chat(chat)
                .sender(sender)
                .message(messageBody)
                .type(messageType.trim())
                .build();

        chat.addMessage(message);
        ChatMessage persisted = chatMessageRepository.save(message);

        return toChatMessageResponseDTO(persisted);
    }

    @Transactional(readOnly = true)
    public List<ChatParticipantDTO> listParticipants(Long chatId) {
        User currentUser = authService.getCurrentUser();
        getMembershipOrThrow(chatId, currentUser.getId());

        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat não encontrado com id: " + chatId));

        return chat.getParticipants().stream()
                .map(this::toParticipantDTO)
                .toList();
    }

    private User findActiveUserOrThrow(Long userId) {
        return userRepository.findByIdAndActiveTrue(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário ativo não encontrado com id: " + userId));
    }

    private ChatResponseDTO toChatResponseDTO(Chat chat, User viewer, ChatUser membership, boolean includeLastMessage) {
        if (viewer != null && membership == null && chat.getId() != null) {
            membership = chatUserRepository.findByChatIdAndUserId(chat.getId(), viewer.getId()).orElse(null);
        }

        ChatMessage lastMessage = chat.getId() != null
                ? chatMessageRepository.findFirstByChatIdOrderBySentAtDescIdDesc(chat.getId()).orElse(null)
                : null;

        Long lastRead = membership != null ? membership.getLastReadMessageId() : null;
        boolean hasUnread = lastMessage != null && (lastRead == null || lastRead < lastMessage.getId());

        return ChatResponseDTO.builder()
                .id(chat.getId())
                .name(chat.getName())
                .createdAt(chat.getCreatedAt())
                .lastMessage(includeLastMessage && lastMessage != null ? toChatMessageResponseDTO(lastMessage) : null)
                .lastReadMessageId(lastRead)
                .hasUnreadMessages(hasUnread)
                .participants(chat.getParticipants().stream()
                        .map(this::toParticipantDTO)
                        .toList())
                .build();
    }

    private ChatParticipantDTO toParticipantDTO(ChatUser chatUser) {
        User user = chatUser.getUser();
        return ChatParticipantDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .type(user.getType())
                .build();
    }

    private ChatMessageResponseDTO toChatMessageResponseDTO(ChatMessage message) {
        return ChatMessageResponseDTO.builder()
                .id(message.getId())
                .message(message.getMessage())
                .type(message.getType())
                .sentAt(message.getSentAt())
                .sender(toParticipantDTO(message.getSender()))
                .build();
    }

    private ChatParticipantDTO toParticipantDTO(User user) {
        return ChatParticipantDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .type(user.getType())
                .build();
    }

    private ChatUser getMembershipOrThrow(Long chatId, Long userId) {
        return chatUserRepository.findByChatIdAndUserId(chatId, userId)
                .orElseThrow(() -> new AccessDeniedException("Usuário não participa deste chat"));
    }
}
