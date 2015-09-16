//
//  ViewController.swift
//  Coach Tracker
//
//  Created by Christopher Kelley on 5/8/15.
//  Copyright (c) 2015 Christopher Kelley. All rights reserved.
//

import UIKit

class ViewController: UIViewController {

    
    @IBOutlet weak var webview: UIWebView!
    
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        loadUrl()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    func loadUrl(){
        NSURLCache.sharedURLCache().removeAllCachedResponses()
        webview.loadRequest(NSURLRequest(URL: NSURL(string: "http://www.coachtracker.org")!))
    }
    
    

}

