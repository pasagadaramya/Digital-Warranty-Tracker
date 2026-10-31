
package com.example.demo;

import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5174")
@RequestMapping("/api/warranty")
public class WarrantyController {

    private final WarrantyService warrantyService;

    public WarrantyController(WarrantyService warrantyService) {
        this.warrantyService = warrantyService;
    }

    @PostMapping("/check")
    public String checkWarranty(@RequestBody Warranty warranty) {
        return warrantyService.checkWarranty(warranty);
    }
}
