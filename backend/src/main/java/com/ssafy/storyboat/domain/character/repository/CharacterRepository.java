package com.ssafy.storyboat.domain.character.repository;

import com.ssafy.storyboat.domain.character.entity.StudioCharacter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CharacterRepository extends JpaRepository<StudioCharacter, Long> {
    @Query("SELECT sc FROM StudioCharacter sc WHERE sc.studio.studioId = :studioId")
    List<StudioCharacter> findByStudioId(Long studioId);
}