package com.youridea.admin.repository;

import com.youridea.admin.model.PricingPlan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PricingPlanRepository extends JpaRepository<PricingPlan, Long> {
}
