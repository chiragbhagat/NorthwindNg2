import { Component, EventEmitter, Input, Output, OnInit,
	HostBinding, trigger, transition, animate,
	style, state } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { ProductsData, ProductsService } from './Products.service';
import { SuppliersData, SuppliersService } from '../Suppliers/Suppliers.service';
import { CategoriesData, CategoriesService } from '../Categories/Categories.service';


@Component({
	selector: 'my-Products-add',
	templateUrl: './ProductsAdd.component.html',
	providers: [ProductsService
		, SuppliersService, CategoriesService
		],
	animations: [
    trigger('routeAnimation', [
      state('*',
        style({
          opacity: 1,
          transform: 'translateX(0)'
        })
      ),
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateX(-100%)'
        }),
        animate('0.2s ease-in')
      ]),
      transition(':leave', [
        animate('0.5s ease-out', style({
          opacity: 0,
          transform: 'translateY(100%)'
        }))
      ])
    ])
  ]
})

export class ProductsAddComponent implements OnInit {
	@HostBinding('@routeAnimation') get routeAnimation() {
		return true;
	}

	@HostBinding('style.display') get display() {
		return 'block';
	}

	// @HostBinding('style.position') get position() {
	//  return 'absolute';
	// }

	objProducts: ProductsData;
	errorMessage: string;
	messages: string[];

	// Lookup Arrays
	
	SuppliersList: SuppliersData[];
	CategoriesList: CategoriesData[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ProductsService: ProductsService
			, private  SuppliersService:  SuppliersService
			, private  CategoriesService:  CategoriesService

	) {
		this.objProducts = new ProductsData();
	}

	ngOnInit() {
		this.objProducts = new ProductsData();
		this.getLookups();
	}

	addRegion() {
		this.ProductsService.addProductsData(this.objProducts)
			.subscribe(record => this.router.navigate(['/Products']),
			error =>  this.errorMessage = 'There was an error while adding record. Error: ' + <any>error,
			() => { console.log('Products record added successfully...'); }
		);
	}

	gotoProducts() {
		let Id = this.objProducts ? this.objProducts.ProductID : null;
		this.router.navigate(['/Products']);
	}

	// Get Lookup List for Suppliers
    getSuppliers() {
		this.SuppliersService.getAll().subscribe(records => this.SuppliersList=records);
    }
	// Get Lookup List for Categories
    getCategories() {
		this.CategoriesService.getAll().subscribe(records => this.CategoriesList=records);
    }

	getLookups() {

        this.getSuppliers();
        this.getCategories();
	}

	log(msg: string) {
		this.messages.splice(0, 0, msg);
		console.log(msg);
	}
}
	