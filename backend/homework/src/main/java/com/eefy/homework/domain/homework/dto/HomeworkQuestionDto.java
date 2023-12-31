package com.eefy.homework.domain.homework.dto;

import com.eefy.homework.domain.homework.persistence.entity.enums.HomeworkQuestionType;
import com.querydsl.core.annotations.QueryProjection;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class HomeworkQuestionDto {

    private Integer id;
    private Integer homeworkId;
    private String title;
    private String content;
    private String filePath;
    private HomeworkQuestionType type;
    private String answer;

    @QueryProjection
    public HomeworkQuestionDto(Integer homeworkQuestionId, Integer homeworkId, String title, String content,
        String filePath, HomeworkQuestionType type, String answer) {
        this.id = homeworkQuestionId;
        this.homeworkId = homeworkId;
        this.title = title;
        this.content = content;
        this.filePath = filePath;
        this.type = type;
        this.answer = answer;
    }
}
