package com.youridea.admin.controller;

import com.youridea.admin.model.Enquiry;
import com.youridea.admin.model.PricingPlan;
import com.youridea.admin.model.Project;
import com.youridea.admin.model.ServiceOffer;
import com.youridea.admin.repository.EnquiryRepository;
import com.youridea.admin.repository.PricingPlanRepository;
import com.youridea.admin.repository.ProjectRepository;
import com.youridea.admin.repository.ServiceOfferRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AdminController {

    private final ProjectRepository projectRepository;
    private final EnquiryRepository enquiryRepository;
    private final ServiceOfferRepository serviceOfferRepository;
    private final PricingPlanRepository pricingPlanRepository;

    public AdminController(ProjectRepository projectRepository,
                          EnquiryRepository enquiryRepository,
                          ServiceOfferRepository serviceOfferRepository,
                          PricingPlanRepository pricingPlanRepository) {
        this.projectRepository = projectRepository;
        this.enquiryRepository = enquiryRepository;
        this.serviceOfferRepository = serviceOfferRepository;
        this.pricingPlanRepository = pricingPlanRepository;
    }

    @GetMapping("/overview")
    public Map<String, Object> overview() {
        Map<String, Object> data = new HashMap<>();
        data.put("totalProjects", projectRepository.count());
        data.put("activeClients", projectRepository.findAll().size());
        data.put("responseTime", "24h");
        data.put("salesThisMonth", "₹1.8L");
        return data;
    }

    @GetMapping("/projects")
    public List<Project> getProjects() {
        return projectRepository.findAll();
    }

    @PostMapping("/projects")
    public ResponseEntity<Project> createProject(@Valid @RequestBody Project project) {
        Project saved = projectRepository.save(project);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/projects/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        if (!projectRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        projectRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/enquiries")
    public List<Enquiry> getEnquiries() {
        return enquiryRepository.findAll();
    }

    @PostMapping("/enquiries")
    public ResponseEntity<Enquiry> createEnquiry(@Valid @RequestBody Enquiry enquiry) {
        Enquiry saved = enquiryRepository.save(enquiry);
        return ResponseEntity.ok(saved);
    }

    @PatchMapping("/enquiries/{id}/status")
    public ResponseEntity<Enquiry> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        return enquiryRepository.findById(id)
            .map(enquiry -> {
                if (payload.containsKey("status")) {
                    enquiry.setStatus(payload.get("status"));
                }
                return ResponseEntity.ok(enquiryRepository.save(enquiry));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/services")
    public List<ServiceOffer> getServices() {
        return serviceOfferRepository.findAll();
    }

    @PostMapping("/services")
    public ResponseEntity<ServiceOffer> createService(@Valid @RequestBody ServiceOffer serviceOffer) {
        ServiceOffer saved = serviceOfferRepository.save(serviceOffer);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/services/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        if (!serviceOfferRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        serviceOfferRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/pricing")
    public List<PricingPlan> getPricing() {
        return pricingPlanRepository.findAll();
    }

    @PostMapping("/pricing")
    public ResponseEntity<PricingPlan> createPlan(@Valid @RequestBody PricingPlan pricingPlan) {
        PricingPlan saved = pricingPlanRepository.save(pricingPlan);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/pricing/{id}")
    public ResponseEntity<Void> deletePlan(@PathVariable Long id) {
        if (!pricingPlanRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        pricingPlanRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
