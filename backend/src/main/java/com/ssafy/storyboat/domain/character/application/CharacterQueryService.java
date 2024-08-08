package com.ssafy.storyboat.domain.character.application;

import com.ssafy.storyboat.domain.character.dto.CharacterResponse;
import com.ssafy.storyboat.domain.character.entity.StudioCharacter;
import com.ssafy.storyboat.domain.character.repository.CharacterRepository;
import com.ssafy.storyboat.domain.studio.application.authorization.StudioReadAuthorization;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CharacterQueryService {

    private final CharacterRepository characterRepository;

    @StudioReadAuthorization
    public List<CharacterResponse> getCharactersByStudioId(Long studioId, Long userId) {
        List<StudioCharacter> characters = characterRepository.findByStudioId(studioId);
        return characters.stream().map(character -> CharacterResponse.builder()
                        .id(character.getStudioCharacterId())
                        .name(character.getName())
                        .description(character.getDescription())
                        .imageUrl(character.getImageUrl())
                        .tags(character.getTags())
                        .build())
                .collect(Collectors.toList());
    }
}