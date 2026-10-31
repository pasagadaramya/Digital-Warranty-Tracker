
package com.example.demo;

import java.time.LocalDate;

import org.springframework.stereotype.Service;

@Service
public class WarrantyService {

    public String checkWarranty(Warranty warranty) {

        LocalDate expiryDate = warranty.getPurchaseDate()
                .plusMonths(warranty.getWarrantyMonths());

        if (!LocalDate.now().isAfter(expiryDate)) {
            return "Active";
        } else {
            return "Expired";
        }
    }
}
