package com.eefy.studyclass.domain.lecture.persistence.mysql;


import com.eefy.studyclass.domain.lecture.persistence.entity.Lecture;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LectureRepository extends JpaRepository<Lecture, Integer> {
    List<Lecture> findByStudyClassIdOrderByCreatedAtDesc(int classId);
}
